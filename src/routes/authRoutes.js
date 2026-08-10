const express = require("express");
const authController = require('../controllers/authController');
const router = express.Router();
const authorize = require('../middlewares/authorize');

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/user-info", authorize(), authController.userProfile);

module.exports = router;