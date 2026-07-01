const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema }=require("./schema.js");
const Review = require("./models/review.js");





const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
main().then(() =>{
    console.log("connected to DB");
}).catch(err =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// api set
app.get("/" , (req,res)=>{
    res.send("Api is working");
});

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


const validateReview = (req, res ,next) => {

      let {error}= reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};




// index route
app.get("/listings", wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New route
  app.get("/listings/new", (req,res) =>{
    res.render("listings/new.ejs");
  });

// Show route
  app.get("/listings/:id" , wrapAsync(async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing }); 
  })
);

  // Create route
   app.post("/listings", validateListing, wrapAsync(async (req,res,next) =>{
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
    res.redirect("/listings");
   })
   );


   // Edit route
    app.get("/listings/:id/edit", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
   }));

   // Update route
//     app.put("/listings/:id", async (req,res) =>{
//     let {id} = req.params;
//     const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {new:true});
//     res.redirect(`/listings/${listing._id}`);
//    });

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {

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

    res.redirect(`/listings/${listing._id}`);
}));


   // Delete route
   app.delete("/listings/:id", wrapAsync(async(req,res) =>{
    let { id } =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
   }));

   // Review route
   // POST route
   app.post("/listings/:id/reviews", validateReview, wrapAsync ( async (req, res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
   }));

   // Delete Review Route
   app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) =>{
    let { id, reviewId } =req.params;
    await Review.findById(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
   })
   );



// listing models routing

// app.get("/testListing", async(req,res) => {
//     let sampleListing =new Listing({
//     tittle: "My New Villa",
//     description: "By the Beach",
//     price: 1200,  
//     location:"Calangute,Goa",

// });

// await sampleListing.save();
// console.log("Sample was saved");
// res.send("Succesfully testing");
// });

// route not match 
app.all("/*splat", (req, res, next ) =>{
     next(new ExpressError(404, "Page Not Found !"));
});

// Error handling
app.use((err,req,res,next) => {
    // console.log("ERROR =", err);
    let { statusCode = 500 , message = "Something went wrong!  "} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",  {message});

});

// server connection
app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});
