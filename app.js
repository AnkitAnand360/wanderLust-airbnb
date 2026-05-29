const express=require("express");
const app=express();
const mongoose=require("mongoose");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
main().then(() =>{
    console.log("connected to DB");
}).catch(err =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// api set
app.get("/" , (req,res)=>{
    res.send("Api is working");
});

// server connection
app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});
