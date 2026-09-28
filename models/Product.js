const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true, $gt:0},
    category: {type:String, required:true},
    inStock: {type:Boolean, default:true},
    tags: {type:[String]}, //Array[String]
    createdAt:{type:Date, default:()=>Date.now()}
});
const Product = mongoose.model('Product',productSchema);
module.exports = Product;