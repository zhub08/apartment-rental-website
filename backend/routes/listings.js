const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

// Get all listings
router.get('/', listingController.getListings);

// Get featured listings
router.get('/featured', listingController.getFeaturedListings);

// Get dynamic filter options
router.get('/filters', listingController.getFilterOptions);

// Get a single listing by ID
router.get('/:id', listingController.getListingById);

module.exports = router;
