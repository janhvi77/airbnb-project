const Listing = require("./models/listing");
const ExpressError = require("./utils/expresserror.js");
const Review = require("./models/review")
const { listingSchema, reviewSchema } = require("./schema.js");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
};
// Middleware to check ownership
module.exports.isOwner = async(req, res, next) => {
    try {
        let { id } = req.params;

        // Find listing
        let listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        // Check ownership
        if (!req.user || !listing.owner.equals(req.user._id)) {
            req.flash("error", "you are not owner of this listing");
            return redirect(`/listings/${id}`)
        }

        next(); // user is owner → continue
    } catch (err) {
        next(err);
    }
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else { next(); }
};
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else { next(); }
};
module.exports.isReviewAuthor = async(req, res, next) => {
    try {
        let { id, reviewId } = req.params;

        // Find listing
        let review = await Riview.findById(reviewId);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        // Check ownership
        if (!listing.author.equals(req.user._id)) {
            req.flash("error", "you are not owner of this listing");
            return redirect(`/listings/${id}`)
        }

        next(); // user is owner → continue
    } catch (err) {
        next(err);
    }
};