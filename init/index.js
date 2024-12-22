const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const Mongo_URL = "mongodb://127.0.0.1:27017/stay";


main()
.then(()=>{
    console.log("conneted to DB");
})
.catch((err)=>{
    
    console.log(err);
})
async function main() {
    await mongoose.connect(Mongo_URL);
}

const initDB = async ()=> {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({
        ...obj,
        owner:"67619399aff410f35605a36c",
    }));
    await Listing.insertMany(initdata.data);
    console.log("data initialized")
}

initDB().catch(err=>{
    console.log(err);
});