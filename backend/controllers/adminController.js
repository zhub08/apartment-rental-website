const Listing = require('../models/Listing');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const listingController = require('./listingController'); // Import listingController

// Admin login logic
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).send({ error: 'Invalid login credentials.' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid login credentials.' });
        }

        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ admin: { _id: admin._id, email: admin.email }, token });
    } catch (error) {
        // Standardize error response
        console.error(error); // Log the actual error on the server
        res.status(500).send({ error: 'An internal server error occurred.' });
    }
};

// Admin function to get all listings with pagination
exports.getAdminListings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const listings = await Listing.find({}).skip(skip).limit(limit);
        const totalListings = await Listing.countDocuments({});
        const totalPages = Math.ceil(totalListings / limit);

        res.status(200).send({ listings, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An internal server error occurred.' });
    }
};

// Admin functions now delegate to listingController
exports.createAdminListing = listingController.createListing;
exports.updateAdminListing = listingController.updateListing;
exports.deleteAdminListing = listingController.deleteListing;

// Forgot password logic
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            // To prevent enumeration attacks, don't reveal that the user doesn't exist.
            return res.status(200).send({ message: 'A password reset link has been sent to your email address.' });
        }

        // Generate token
        const token = crypto.randomBytes(20).toString('hex');

        // Hash the token and set expiration on admin model
        admin.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await admin.save();

        // In a real app, you would send an email with the unhashed token. Here, we'll log it.
        const resetURL = `http://localhost:3001/reset-password/${token}`;
        console.log('Password reset link:', resetURL);

        res.status(200).send({ message: 'A password reset link has been sent to your email address.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An internal server error occurred.' });
    }
};

// Reset password logic
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Hash the incoming token to match the one in the database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const admin = await Admin.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).send({ error: 'Password reset token is invalid or has expired.' });
        }

        // Add password complexity validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send({ 
                error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
            });
        }

        // Set the new password
        admin.password = password;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;

        await admin.save();

        res.status(200).send({ message: 'Password has been successfully reset.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An internal server error occurred.' });
    }
};
