import express from "express";

import { createNewProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../handlers/product.handler.js";

const router = express.Router();

router.get("/:id", getProductById);
router.get("/", getAllProducts);
router.post("/", createNewProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;