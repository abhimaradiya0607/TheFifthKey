const mongoose = require('mongoose')
const Review = require("./reviews.js")


let listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reviews",
        }
    ],
    owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
        },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;