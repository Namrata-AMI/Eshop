const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
    category:{
        type:String,
        required:true,
        enum:["Electronics","Clothing","Home Appliances","Books","Toys","Outerwear","Other", "Jewelery", "Men's clothing", "Women's clothing"],
    },
    stock:{
        type:Number,
        required:true,
        min:0,
        default:10,
    },
    images:[
        {
            type:String,
            required:true,
        },
    ],
    brand:{
        type:String,
        required:true,
    }
});


module.exports = mongoose.model("Product",productSchema);