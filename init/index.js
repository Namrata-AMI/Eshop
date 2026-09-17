const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const initData = require("./data");
const Product = require("../models/product");

const dbUrl = process.env.MONGO_URL;

async function main() {
    await mongoose.connect(dbUrl);
    console.log("DB Connected");
}

main()
    .then(() => initDB())
    .catch(err => console.log(err));

const initDB = async () => {
    await Product.deleteMany({});

    await Product.insertMany(initData.data);

    console.log("Data was initialized");
    mongoose.connection.close();
};