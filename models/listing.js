const mongoose =require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,
     image: {
        filename: {
            type: String,
            default: "listingimage",
        },

        url: {
            type: String,
            default:
                "https://news.airbnb.com/wp-content/uploads/sites/4/2022/11/10_Elegant-Secluded-Cabin.jpg?resize=2048,1365",
        },
    },
    price: Number, 
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

// mongoose middleware to delete associated reviews when a listing is deleted from database
 listingSchema.post("findOneAndDelete" , async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
 });


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;