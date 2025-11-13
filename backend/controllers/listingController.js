const Listing = require('../models/Listing');

// Create a new listing
exports.createListing = async (req, res) => {
    try {
        const rawData = JSON.parse(req.body.listing);

        // Whitelist fields to prevent mass assignment
        const safeData = {
            title: rawData.title,
            description: rawData.description,
            address: rawData.address,
            location: rawData.location,
            price: rawData.price,
            currency: rawData.currency,
            bedrooms: rawData.bedrooms,
            bathrooms: rawData.bathrooms,
            squareFootage: rawData.squareFootage,
            propertyType: rawData.propertyType,
            listingType: rawData.listingType,
            amenities: rawData.amenities,
            contactInfo: rawData.contactInfo,
            featuredImage: rawData.featuredImage,
            videoURL: rawData.videoURL,
        };

        const listing = new Listing(safeData);

        if (req.files) {
            listing.images = req.files.map(file => file.path);
            if (rawData.featuredImage) {
                const featuredFile = req.files.find(file => file.originalname === rawData.featuredImage);
                if (featuredFile) {
                    listing.featuredImage = featuredFile.path;
                }
            }
        }

        await listing.save();
        res.status(201).send(listing);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Invalid data provided.' });
    }
};

// Get all listings
exports.getListings = async (req, res) => {
    try {
        const { search, listingType, bedrooms, minPrice, maxPrice, page = 1, limit = 8 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
            ];
        }

        if (listingType) {
            query.listingType = listingType;
        }

        if (bedrooms) {
            query.bedrooms = { $gte: parseInt(bedrooms, 10) };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                query.price.$gte = parseInt(minPrice, 10);
            }
            if (maxPrice) {
                query.price.$lte = parseInt(maxPrice, 10);
            }
        }

        const listings = await Listing.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        
        const count = await Listing.countDocuments(query);

        res.status(200).json({
            listings,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An internal server error occurred.' });
    }
};

// Get dynamic filter options
exports.getFilterOptions = async (req, res) => {
    try {
        const listingTypes = await Listing.distinct('listingType');
        const propertyTypes = await Listing.distinct('propertyType');

        const priceStats = await Listing.aggregate([
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            { $project: { _id: 0 } }
        ]);

        const bedroomStats = await Listing.aggregate([
            {
                $group: {
                    _id: null,
                    minBedrooms: { $min: '$bedrooms' },
                    maxBedrooms: { $max: '$bedrooms' },
                }
            },
            { $project: { _id: 0 } }
        ]);

        const bathroomStats = await Listing.aggregate([
            {
                $group: {
                    _id: null,
                    minBathrooms: { $min: '$bathrooms' },
                    maxBathrooms: { $max: '$bathrooms' },
                }
            },
            { $project: { _id: 0 } }
        ]);

        const squareFootageStats = await Listing.aggregate([
            {
                $group: {
                    _id: null,
                    minSquareFootage: { $min: '$squareFootage' },
                    maxSquareFootage: { $max: '$squareFootage' },
                }
            },
            { $project: { _id: 0 } }
        ]);

        res.status(200).json({
            listingTypes,
            propertyTypes,
            price: priceStats[0] || { minPrice: 0, maxPrice: 0 },
            bedrooms: bedroomStats[0] || { minBedrooms: 0, maxBedrooms: 0 },
            bathrooms: bathroomStats[0] || { minBathrooms: 0, maxBathrooms: 0 },
            squareFootage: squareFootageStats[0] || { minSquareFootage: 0, maxSquareFootage: 0 },
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An internal server error occurred.' });
    }
};

// Get a single listing by ID
exports.getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send();
        }

        // Increment the view count
        listing.views += 1;
        await listing.save();

        res.status(200).send(listing);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An internal server error occurred.' });
    }
};

// Update a listing by ID
exports.updateListing = async (req, res) => {
    try {
        const rawData = JSON.parse(req.body.listing);
        const allowedUpdates = ['title', 'description', 'address', 'location', 'price', 'currency', 'bedrooms', 'bathrooms', 'squareFootage', 'propertyType', 'listingType', 'images', 'amenities', 'contactInfo', 'featuredImage', 'videoURL'];

        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send();
        }

        // Create a safe object with only the allowed updates
        const safeUpdates = {};
        allowedUpdates.forEach((update) => {
            if (rawData.hasOwnProperty(update)) {
                safeUpdates[update] = rawData[update];
            }
        });

        // Apply the safe updates
        Object.assign(listing, safeUpdates);

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            // Combine new images with existing ones from the form data
            listing.images = [...(rawData.images || []), ...newImages];

            if (rawData.featuredImage) {
                const featuredFile = req.files.find(file => file.originalname === rawData.featuredImage);
                if (featuredFile) {
                    listing.featuredImage = featuredFile.path;
                }
            }
        }

        await listing.save();
        res.status(200).send(listing);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Invalid data provided.' });
    }
};

// Delete a listing by ID
exports.deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndDelete(req.params.id);
        if (!listing) {
            return res.status(404).send();
        }
        res.status(200).send(listing);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An internal server error occurred.' });
    }
};

// Get featured listings (top 4 by views)
exports.getFeaturedListings = async (req, res) => {
    try {
        const listings = await Listing.find({}).sort({ views: -1 }).limit(4);
        res.status(200).send(listings);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An internal server error occurred.' });
    }
};
