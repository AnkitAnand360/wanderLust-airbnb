const mongoose =require("mongoose");
const Schema=mongoose.Schema;

const listingSchema = new Schema({
    tittle: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        default: "https://news.airbnb.com/wp-content/uploads/sites/4/2022/11/10_Elegant-Secluded-Cabin.jpg?resize=2048,1365",
        type: String,
        set:(v) => v ==="" ? "https://news.airbnb.com/wp-content/uploads/sites/4/2022/11/10_Elegant-Secluded-Cabin.jpg?resize=2048,1365" : v,
    },
    price: Number, 
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;