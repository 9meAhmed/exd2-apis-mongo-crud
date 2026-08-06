const Category = require('../models/Category');

exports.addCategory = async (body) => {
    const newCategory = new Category(body);
    return await newCategory.save();
};

exports.checkCategoryExist = async (name) => {
    return await Category.exists({ name: name });
};