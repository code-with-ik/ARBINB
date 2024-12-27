const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");


main().then(()=>{
    console.log("connection successfull!");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/arbinb');
}

const initDB = async()=>{
    await Listing.deleteMany({});
    const modifiedData = initData.data.map((obj)=> ({...obj, owner : '675c20d6a816b7fc7e1c3836' }))
    await Listing.insertMany(modifiedData);
}

initDB();