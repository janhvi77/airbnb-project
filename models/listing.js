const mongoose = require("mongoose");
const review = require("./review").default;
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review"
    }],
    //
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },



});

const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);;
module.exports = Listing;