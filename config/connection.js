const mongoose = require('mongoose');
require('dotenv').config();
// {new:true};
mongoose.set("runValidators",true);
const uri = process.env.MONGO_URI;

// Connect to MongoDB & handle the promise
mongoose.connect(uri)
.then(()=>console.log('Successfully connected to Mongo DB...'))
.catch(error=>console.log('Connection error :', error));
