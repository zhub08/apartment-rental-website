const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Admin login route
router.post('/login', adminController.adminLogin);

// Password reset routes
router.post('/forgot-password', adminController.forgotPassword);
router.post('/reset-password/:token', adminController.resetPassword);

// Admin route to get all listings
router.get('/listings', auth, adminController.getAdminListings);

// Admin route to create a listing
router.post('/listings', auth, upload, adminController.createAdminListing);

// Admin route to update a listing
router.patch('/listings/:id', auth, upload, adminController.updateAdminListing);

// Admin route to delete a listing
router.delete('/listings/:id', auth, adminController.deleteAdminListing);

module.exports = router;
