const Product = require('../models/Product');

exports.addProduct = async (body) => {
    const newProduct = new Product(body);
    const savedProduct = await newProduct.save();
    return savedProduct.populate({
        path: 'category',
        select: 'name slug -_id',
        match: { isActive: true },
    });
};