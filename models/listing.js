const mongoose =require("mongoose");
const Schema=mongoose.Schema;

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
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;