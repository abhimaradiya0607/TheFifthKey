const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require('../utils/ExpressError.js')
const Listing = require('../models/listing.js');
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const { populate } = require('../models/reviews.js');
const ListingController = require('../controllers/listings.js');


//Listing index route
//New Listing is added 
router.route('/')
.get(wrapAsync(ListingController.index))
.post(validateListing, isLoggedIn,wrapAsync(ListingController.newListing));

//New listing FORM route
router.get('/new', isLoggedIn,ListingController.newForm);


//Show Route
//Edit/Update Route and Save
//delets GET request

router.route('/:id')
.get(wrapAsync(ListingController.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(ListingController.listingupadtesaved))
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.listingDelete));


//Listing Edit/Update Form
router.get('/:id/edit', isLoggedIn,isOwner,wrapAsync(ListingController.listingUpdateform));

module.exports = router;