import express from 'express';
import dotnev from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';
import mongoose from 'mongoose';

dotnev.config(); //reads .env file and adds the keys into process.env so we can retrieve its values)

const app = express();
app.use(express.json());

app.get("/api/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            res.status(204).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });

    } catch (error) {
        console.log(`Error while fetching product`,)
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

app.get("/api/products", async (_, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });

    } catch (error) {
        console.log(`Error while fetching products`,)
        res.status(400).json({ success: false, message: 'Server Error' });
    }
});

app.post("/api/products", async (req, res) => {
    const product = await req.body;

    if (!product) return res.status(400).json({ success: false, message: 'empty body' });

    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();

        res.status(201)
            .json({ success: false, data: newProduct })
            ;
    } catch (error) {
        console.error("Error during save operation: ", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;

    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Invalid id' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(204).json({ success: true, message: `product with id ${id} updated successfully`, data: updatedProduct });

    } catch (error) {
        console.log(`Error while trying to update the product: ${error.message} `);
        res.status(500).json({ success: false, message: 'Server Error' });
    }

});

app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        console.error(`Error while trying to delete product with id: ${id}`);
        res.status(500).json({ success: false, message: `could not delete product with id: ${id}` });
    }

});
console.log(process.env.MONGO_URI);

const port = 5000;

app.listen(port, () => {
    connectDB();
    console.log(`App running on http://localhost:${port} hello`)
});