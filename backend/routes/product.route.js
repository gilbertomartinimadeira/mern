import { express } from "express";
import Product from './models/Product.js';
import mongoose from 'mongoose';

const router = express.Router();


router.get("/:id", async (req, res) => {
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

router.get("/", async (_, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });

    } catch (error) {
        console.log(`Error while fetching products`,)
        res.status(400).json({ success: false, message: 'Server Error' });
    }
});

router.post("/", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        console.error(`Error while trying to delete product with id: ${id}`);
        res.status(500).json({ success: false, message: `could not delete product with id: ${id}` });
    }

});


export default router;

