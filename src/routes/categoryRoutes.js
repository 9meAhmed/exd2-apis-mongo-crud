const express = require("express");
const Joi = require('joi');

const Category = require('../models/Category');
const categoryController = require('../controllers/categoryController');
const validate = require('../middlewares/validate');
const categoryValidation = require('../validations/categoryValidation');

const router = express.Router();

router.get("/:id", async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await Category.findById(categoryId);

        if (!category) {
            res.status(404).json({ message: "category not found" });
        } else {
            res.json(category);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

router.post("/", validate(categoryValidation.createCategorySchema), categoryController.addCategory);

router.put("/:id", async (req, res) => {
    const categoryId = req.params.id;
    const payload = req.body;

    try {

        // const schema = Joi.object({
        //     name: Joi.string().required(),
        //     slug: Joi.string().required(),
        //     isActive: Joi.boolean(),
        // });

        // const { error, value } = schema.validate(payload);

        // if (error) {
        //     return res.status(400).json(error.details);
        // }

        // 

        const isDuplicate = await Category.exists({ name: payload.name, _id: { $ne: categoryId } });

        if(isDuplicate) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, payload, { new: true });

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});



module.exports = router;