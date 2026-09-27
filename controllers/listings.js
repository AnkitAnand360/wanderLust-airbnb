const Listing = require('../models/listing');
const User = require('../models/user');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let category = req.query.category;
    let query = {};
    if (category) {
        query.category = category;
    }
    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).
        populate({
            path: "reviews", populate: { path: "author" },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing You requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: url, filename: filename };

    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
};



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {


    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };

        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};

module.exports.toggleFavorite = async (req, res) => {
    let { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
        if (req.xhr || req.headers.accept?.includes("application/json")) {
            return res.status(401).json({ success: false, redirectUrl: "/login", message: "Please log in first!" });
        }
        req.flash("error", "You must be logged in to favorite listings!");
        return res.redirect("/login");
    }

    const index = user.favorites.findIndex((favId) => favId.toString() === id.toString());
    let isFavorite = false;

    if (index > -1) {
        user.favorites.splice(index, 1);
        isFavorite = false;
    } else {
        user.favorites.push(id);
        isFavorite = true;
    }

    await user.save();

    if (req.xhr || req.headers.accept?.includes("application/json")) {
        return res.json({
            success: true,
            isFavorite,
            count: user.favorites.length,
            message: isFavorite ? "Added to favorites!" : "Removed from favorites!"
        });
    }

    req.flash("success", isFavorite ? "Added to favorites!" : "Removed from favorites!");
    res.redirect(req.get("Referrer") || "/listings");
};