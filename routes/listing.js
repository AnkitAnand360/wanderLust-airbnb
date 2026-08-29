const express = require("express");
const router = express.Router();
const Listing=require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema  }=require("../schema.js");


//  Validate schema middleware

const validateListing = (req, res ,next) => {
      let {error}= listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};


// index route
router.get("/", wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New route
  router.get("/new", (req,res) =>{
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to create a new listing!");
        return res.redirect("/login");
    }
    res.render("listings/new.ejs");
  });

// Show route
  router.get("/:id" , wrapAsync(async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing You requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing }); 
  })
);

// Create route
   router.post("/", validateListing, wrapAsync(async (req,res,next) =>{
    // if(!req.body.listing) throw new ExpressError(400, "Invalid Listing Data");
    // let {tittle, description, price, location} = req.body;
      
         const newListing = new Listing(req.body.listing);

        //  if(!newListing.title){
        //     throw new ExpressError(400, "Title is missing!");
        //  }
        //  if(!newListing.description){
        //     throw new ExpressError(400, "Description is missing!");
        //  }
        //  if(!newListing.location){
        //     throw new ExpressError(400, "Location is missing!");
        //  }

    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
   })
   );


   // Edit route
    router.get("/:id/edit", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing You requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
   }));

   // Update route
//     app.put("/listings/:id", async (req,res) =>{
//     let {id} = req.params;
//     const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {new:true});
//     res.redirect(`/listings/${listing._id}`);
//    });

router.put("/:id", validateListing, wrapAsync(async (req, res) => {

    //  console.log("PUT BODY:", req.body);
    // console.log("PUT LISTING:", req.body.listing);

    let { id } = req.params;

    let listingData = req.body.listing;

    listingData.image = {
        filename: "listingimage",
        url: listingData.image,
    };

    const listing = await Listing.findByIdAndUpdate(
        id,
        listingData,
        { returnDocument: "after" }
    );
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
}));


   // Delete route
   router.delete("/:id", wrapAsync(async(req,res) =>{
    let { id } =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
   }));

 module.exports = router;