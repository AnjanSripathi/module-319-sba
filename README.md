# Product API

A lightweight Express and MongoDB API for managing products. This project allows you to create, read, update, and delete product records, and includes advanced filtering, sorting, and pagination support.

## Overview

This application exposes a REST API for a product catalog and uses:

- Node.js
- Express.js
- MongoDB
- Mongoose

The API is configured in [server.js](server.js) and the product routes are defined in [routes/productRoutes.js](routes/productRoutes.js). The Product schema is defined in [models/Product.js](models/Product.js).

## Project Structure

```text
module-319/
└── sba/
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── server.js
    ├── config/
    │   └── connection.js
    ├── models/
    │   └── Product.js
    ├── routes/
    │   └── productRoutes.js
    └── README.md
```

## Features

- Create a new product
- Get all products
- Get a single product by ID
- Update a product
- Delete a product
- Filter by category
- Filter by price range
- Sort by price ascending or descending
- Paginate results

## Requirements

Before running the project, make sure you have:

- Node.js installed
- npm installed
- MongoDB running locally or a valid MongoDB Atlas connection string

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with your MongoDB connection string:

   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/productsdb
   ```

   Replace the example connection string with your own MongoDB URI.

3. Start the server:

   ```bash
   npm run dev
   ```

   Or run it with the default start script:

   ```bash
   npm start
   ```

The server will run on:

```text
http://localhost:3000
```

## Product Schema

The schema is defined in [models/Product.js](models/Product.js) and includes the following fields:

| Field | Type | Required | Default |
| --- | --- | --- | --- |
| `name` | String | Yes | - |
| `description` | String | Yes | - |
| `price` | Number | Yes | - |
| `category` | String | Yes | - |
| `inStock` | Boolean | No | `true` |
| `tags` | Array of Strings | No | - |
| `createdAt` | Date | No | current date/time |

## API Endpoints

Base URL:

```text
/api/products
```

### 1. Create Product

```http
POST /api/products
```

Request body example:

```json
{
  "name": "Wireless Headphones",
  "description": "Noise-cancelling over-ear headphones with 30-hour battery life.",
  "price": 149.99,
  "category": "Electronics",
  "inStock": true,
  "tags": ["audio", "wireless", "bluetooth"]
}
```

### 2. Read All Products

```http
GET /api/products
```

Optional query parameters:

- `category`: filter by category
- `minPrice`: minimum price
- `maxPrice`: maximum price
- `sortBy`: `price_asc` or `price_desc`
- `page`: page number
- `limit`: number of records per page

Examples:

```http
GET /api/products?category=Electronics
GET /api/products?minPrice=100&maxPrice=500
GET /api/products?sortBy=price_desc
GET /api/products?page=2&limit=5
GET /api/products?category=Electronics&minPrice=100&maxPrice=500&sortBy=price_asc&page=1&limit=10
```

### 3. Read One Product

```http
GET /api/products/:id
```

Example:

```http
GET /api/products/64c2dbf6d71e9a12345abcde
```

### 4. Update Product

```http
PUT /api/products/:id
```

Example body:

```json
{
  "name": "Wireless Headphones Pro",
  "description": "Updated premium wireless headphones with improved battery life.",
  "price": 189.99,
  "inStock": false,
  "tags": ["audio", "premium", "wireless"]
}
```

### 5. Delete Product

```http
DELETE /api/products/:id
```

Example:

```http
DELETE /api/products/64c2dbf6d71e9a12345abcde
```

## Example Product Data

```json
[
  {
    "name": "Wireless Headphones",
    "description": "Noise-cancelling over-ear headphones with 30-hour battery life.",
    "price": 149.99,
    "category": "Electronics",
    "inStock": true,
    "tags": ["audio", "wireless", "bluetooth"],
    "createdAt": "2026-09-28T10:00:00.000Z"
  },
  {
    "name": "Office Chair",
    "description": "Ergonomic chair with lumbar support and adjustable height.",
    "price": 89.5,
    "category": "Furniture",
    "inStock": true,
    "tags": ["office", "chair", "ergonomic"],
    "createdAt": "2026-09-28T10:05:00.000Z"
  }
]
```

## Problem-Solving Journey

This project was built through a series of debugging and refinement steps that reflect common issues students run into when working with Express + MongoDB APIs.

### 1. Setting up the database connection

The first major step was connecting the app to MongoDB using Mongoose. The connection logic lives in [config/connection.js](config/connection.js). We had to ensure the environment variable `MONGO_URI` was correctly loaded from `.env`, and that the app was calling `mongoose.connect()` before handling requests.

A common issue in these projects is forgetting to configure the environment file or using the wrong URI format. If the database connection is not established, every route will fail later at runtime.

### 2. Verifying data parsing

Once the app successfully connected to MongoDB, the next problem was receiving JSON data in the request body. The backend needed `express.json()` in [server.js](server.js) so that `req.body` contained the payload sent from Postman.

Without this middleware, the server would still run, but the created product would often be missing expected fields or would fail because the schema required values such as `name`, `description`, and `price`.

### 3. Fixing schema validation problems

The Product schema is defined in [models/Product.js](models/Product.js). We learned that Mongoose validation errors occur when required fields are missing or when a value does not match the expected data type.

For example, if a request body did not include `name` or `description`, Mongoose would reject the document and respond with a validation error. The fix was to ensure the request data matched the schema and to use the correct field types.

### 4. Understanding query filtering and price logic

One of the most important parts of this project was implementing advanced querying for the read route in [routes/productRoutes.js](routes/productRoutes.js). We needed to support optional filters such as:

- `category`
- `minPrice`
- `maxPrice`
- `sortBy`
- `page`
- `limit`

The key lesson was that query parameters are dynamic and must be handled conditionally. We built a `filter` object only when fields were provided, instead of hard-coding a fixed query. This allowed MongoDB to return precise result sets based on the request.

### 5. Correctly combining MongoDB query operators

A common mistake in MongoDB queries is trying to combine operators with JavaScript logic like `||` instead of using actual MongoDB operators such as `$gte` and `$lte` inside the query object.

The working solution is to build the query object like this:

```javascript
if (minPrice || maxPrice) {
  filter.price = {};

  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
}
```

This is a good example of the difference between JavaScript object syntax and MongoDB query syntax.

### 6. Sorting and pagination

Pagination was also a key learning point. We used:

- `skip()` to move past earlier records
- `limit()` to control how many records are returned per page
- `sort()` to arrange results in ascending or descending price order

The final route calculates the correct offset as:

```javascript
const skip = (Number(page) - 1) * Number(limit);
```

This allows the API to return only the required portion of the product list for a selected page.

### 7. Updating and deleting records correctly

The update and delete endpoints also required attention. For delete, we needed to check whether the product existed before returning success. For update, we needed to ensure the route used the correct ID parameter and returned the updated document after the change.

This helped reinforce the importance of route design and how Express URL parameters map to `req.params.id`.

### 8. Final project outcome

The final API now does the following:

- creates products
- reads all products with filtering and sorting
- reads one product by ID
- updates a product
- deletes a product
- handles validation and missing data gracefully

This project demonstrates the full cycle of building a small backend API: schema design, environment configuration, CRUD routes, validation, and query optimization.

## Notes

- The project uses `express.json()` so incoming JSON request bodies are parsed automatically.
- Mongoose validation is enabled with `mongoose.set("runValidators", true);` in [config/connection.js](config/connection.js).
- `tags` is stored as an array of strings, so values should be sent as a JSON array such as `["audio", "wireless"]`.
- For read operations, responses use standard HTTP status codes such as `200` and `404`.


