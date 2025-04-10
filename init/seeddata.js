require("dotenv").config();

const axios = require("axios");
const mongoose = require("mongoose");
const Product = require("../models/product.js");


const dbUrl = process.env.MONGO_URL;

async function fakedata (){
    try{
        await mongoose.connect(dbUrl);
        console.log("MongoDB connected");

        const response = await axios.get("https://fakestoreapi.com/products");

        const fakeData = response.data.map((item) => ({
            name: item.title,
            description: item.description,
            price: item.price,
            category: item.category.charAt(0).toUpperCase() + item.category.slice(1), // Capitalize category
            stock: Math.floor(Math.random() * 50) + 1,
            images: [item.image],
            brand: "Generic" // Since Fake Store doesn't provide brand info
        }));

        await Product.deleteMany({});
        await Product.insertMany(fakeData);

        console.log("Fake store data stored successfully!");
        mongoose.connection.close();
    }
    catch(e){
        console.error("Error seeding fake store:", e);
        mongoose.connection.close();
    }
} 


fakedata();