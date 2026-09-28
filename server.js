// DEPENDENCIES
const dns = require('dns');
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require('dotenv').config();
require('./config/connection');
const port = process.env.PORT;
const express = require('express');
const app = express();
const productRouter = require('./routes/productRoutes');

// Handle all the requests; usually the data is returned in JSON format. So, need to handle that
app.use(express.json());
app.use('/api/products',productRouter)

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});