const express = require("express");

const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const ExpressError = require("../utils/expresserror.js");

const { merge } = require("./listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewere.js")









const reviewcontroller = require("../controllers/review.js");



// Reviews Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewcontroller.newreview));


// Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewcontroller.delete)
);

module.exports = router;