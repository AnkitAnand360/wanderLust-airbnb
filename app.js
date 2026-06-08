const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");


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

// api set
app.get("/" , (req,res)=>{
    res.send("Api is working");
});

// index route
app.get("/listings", async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// Show route

  app.get("/listings/:id" , async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing }); 
  })


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

// server connection
app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});
