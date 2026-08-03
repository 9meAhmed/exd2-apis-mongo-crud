const express = require("express");
const Category = require('../models/Category');

const router = express.Router();

router.post("/", async (req, res) => {
  const payload = req.body;

  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

});


module.exports = router;