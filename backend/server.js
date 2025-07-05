import express from 'express';
import dotnev from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';

dotnev.config(); //reads .env file and adds the keys into process.env so we can retrieve its values)

const app = express();

app.get("/products", (req, res) => {
    res.send("Server is ready! 123");
});

app.post("/products", async (req, res) => {
    const product = req.body;

    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();

        res.status(201)
            .json({ success: false, data: newProduct })
            .header({ 'x-custom-header': 'gilberto' });
    } catch (error) {
        console.error("Error during save operation: ", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

    res.statusCode(201, `Product ${product} created!`);
});

console.log(process.env.MONGO_URI);

const port = 5000;

app.listen(port, () => {
    connectDB();
    console.log(`App running on http://localhost:${port} hello`)
});