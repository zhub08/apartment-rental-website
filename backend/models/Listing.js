const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', 'ETB'],
        default: 'USD',
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    squareFootage: {
        type: Number
    },
    propertyType: {
        type: String,
        enum: ['apartment', 'house', 'condo', 'townhouse', 'land'],
        required: true
    },
    listingType: {
        type: String,
        enum: ['sale', 'rent'],
        required: true
    },
    images: {
        type: [String], // Array of image URLs
        default: []
    },
    featuredImage: {
        type: String // URL of the main image
    },
    videoURL: {
        type: String
    },
    amenities: {
        type: [String], // Array of strings for amenities
        default: []
    },
    contactInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Listing', ListingSchema);
