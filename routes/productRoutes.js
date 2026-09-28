const Product = require('../models/Product');
const express = require('express');
const router = express.Router();

// Create
router.post('/', async(req,res)=>{
    try{
        const product = await Product.create(req.body);
        res.status(201).json({message: "Product created successfully!", product});
    }
    catch(error){
        console.error(error);
        res.status(400).json({message:error.message});
    }
})

// Read
router.get('/', async(req,res)=>{
    // const page = 1;
    // const pageSize = 10; // Change this value to get the required number of items
    const{category, minPrice, maxPrice, sortBy = 'price_asc', page, limit} = req.query;
    const filter = {};
    if(category){
        filter.category = category;
    }
    if(minPrice || maxPrice){
        filter.price={};
        if(minPrice){
            filter.price.$gte = Number(minPrice);
        }
        if(maxPrice){
            filter.price.$lte = Number(maxPrice);
        }
    }
    const sort = sortBy == 'price_desc'?
    {price:-1} : {price:1} ;
    const skip = (Number(page)-1) * Number(limit);
    // limit = Number(limit);
    // const products = await Product.find(
    //     {
    //         category:{$in: ['Electronics', 'Home']},
    //         price: { $gte:100 } || { $lte: 1000},
    //     }
    // ).sort({price: 1}).skip((page - 1)* pageSize).limit(pageSize)
    try{
        const products = await Product
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        res.status(201).json({products});
    }
    catch(error){
        console.error(error);
        res.status(400).json({message:error.message});
    }
})
// Update
router.put('/:id', async(req,res)=>{
    try{
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(201).json({message: "Product updated successfully...", product});
    }
    catch(error){
        console.error(error);
        res.status(404).json({message:error.message});
    }
})

// Delete
router.delete('/:id', async(req,res)=>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(201).json({message:"Product deleted successfully...",product});
    }
    catch(error){
        console.error(error);
        res.status(404).json({message:error.message});
    }
})

// Read a single product
router.get('/:id', async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(201).json({message:"A single product is displayed...",product});
    }
    catch(error){
        console.error(error);
        res.status(404).json({message:error.message});
    }
})
module.exports = router;