const Listing = require("../models/listing.js");
const Review = require("../models/review.js");








module.exports.newreview =
    (async(req, res) => {
        console.log(req.params.id);
        let listing = await Listing.findById(req.params.id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        req.flash("sucess", " new review created");

        res.redirect(`/listings/${listing._id}`);
    });


module.exports.delete =

    (async(req, res) => {
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId }
        });

        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })