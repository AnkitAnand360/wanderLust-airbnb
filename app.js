const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpsOnly: true,
    },           
};

// api set
app.get("/" , (req,res)=>{
    res.send("Api is working");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


  app.use("/listings", listings);
  app.use("/listings/:id/reviews", reviews);

   



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
