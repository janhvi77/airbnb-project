const express = require("express");
const app = express();
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");


const Listing = require("../models/Listing.js");


const mongoose = require("mongoose");
const { isLoggedIn, isOwner, validateListing } = require("../middlewere.js")

const listingController = require("../controllers/listings.js")
    //use for uplode file in form
const multer = require('multer');
const { storage } = require("../cloudconflict.js")
const upload = multer({ storage });


router.get("/search", listingController.searchListings);
router.route("/")
    // Index Route
    .get(wrapAsync(listingController.index))
    // Create Route
    .post(isLoggedIn,
        // isOwner,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing));


// New Route
router.get("/new", isLoggedIn, listingController.renderform);





router.route("/:id")
    // Show Route
    .get(wrapAsync(listingController.showform))
    // Update Route

.put(

        isLoggedIn,
        isOwner,
        // multer pass the img and save in clodinary  
        upload.single("listing[image]"),
        wrapAsync(listingController.update)
    )
    // Delete Route
    .delete(wrapAsync(listingController.delete));







// Edit Route
router.get("/:id/edit", //isLoggedIn,
    isOwner,
    wrapAsync(listingController.editlisting));












//
//console.log(Listing);
module.exports = router;