const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing");
const data = require("./data");
const MONGO_URL = "mongodb://127.0.0.1:27017/test";

main()
    .then(() => {
        console.log("connected to DB");
        initDB(); // ✅ correct place
    })
    .catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
    await Listing.deleteMany({}); // purana data clear karega
    const modifiedData = initData.data.map((obj) => ({...obj, owner: '69de04169b01a7ff8c83bd5b' }));
    await Listing.insertMany(data.data); // data.js ka data insert karega
    console.log("Data inserted");
};

initDB();