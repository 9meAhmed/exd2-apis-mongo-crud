const productService = require('../services/productService');

exports.addProduct = async (req, res, next) => {
    try {
        const savedProduct = await productService.addProduct(req.body);
        res.status(201).json(savedProduct);
    } catch (error) {
        next(error);
    }
};