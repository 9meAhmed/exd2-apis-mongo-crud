const Joi = require('joi');
const Category = require('../models/Category');
const categoryService = require('../services/categoryService');

exports.addCategory = async (req, res) => {
    const payload = req.body;

    try {

        const isDuplicate = await categoryService.checkCategoryExist(payload.name);
        if(isDuplicate) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = await categoryService.addCategory(payload);
        res.status(201).json(newCategory);
    } catch (error) {
       next(error);
    }

};