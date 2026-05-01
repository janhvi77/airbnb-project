const Listing = require("../models/listing");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError"); // ✅ FIX

// INDEX
module.exports.index = async(req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
};

// NEW FORM
module.exports.renderform = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login");
    }
    res.render("listings/new.ejs");
};

// SHOW
module.exports.showform = async(req, res) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid ID");
    }

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings"); // ✅ FIX
    }

    res.render("listings/show.ejs", { listing });
};

// CREATE
module.exports.createListing = async(req, res) => {
    if (!req.file) {
        req.flash("error", "Image is required");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };



    await newListing.save();
    req.flash("success", "New listing created");

    // ✅ Better redirect
    res.redirect(`/listings/${newListing._id}`);
};

// EDIT
module.exports.editlisting = async(req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    //to do changes in image
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "upload/h_300,w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE
module.exports.update = async(req, res) => {
    let { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
    });

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    };
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }


    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.delete = async(req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to delete listing");
        return res.redirect("/login");
    }

    let { id } = req.params;

    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing deleted");
    res.redirect("/listings");
};

// 🔍 SEARCH FUNCTION
module.exports.searchListings = async(req, res) => {
    let query = req.query.q;

    try {
        let listings = await Listing.find({
            title: { $regex: "^" + query, $options: "i" }
        });

        res.render("listings/index", { listings });
    } catch (err) {
        console.log(err);
        res.send("Search error");
    }
};