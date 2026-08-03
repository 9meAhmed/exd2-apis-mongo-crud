const express = require("express");
const Product = require('../models/Product');

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await Product.find().populate({
        path: 'category', // The field in Product that references Category
        select: 'name slug -_id',       // Only return name and slug, omit _id
        match: { isActive: true },     // Only get active categories
    });
    res.json(products);
    res.status(200).end();
});

router.get("/:id", async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId).populate({
            path: 'category', // The field in Product that references Category
            select: 'name slug -_id',       // Only return name and slug, omit _id
            match: { isActive: true },     // Only get active categories
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

router.post("/", async (req, res) => {
    const payload = req.body;

    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();

        res.status(201).json(await savedProduct.populate({
            path: 'category', // The field in Product that references Category
            select: 'name slug -_id',       // Only return name and slug, omit _id
            match: { isActive: true },     // Only get active categories
        }));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const productId = req.params.id;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

router.put("/:id", async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;