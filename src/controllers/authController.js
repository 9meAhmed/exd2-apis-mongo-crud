const Joi = require('joi');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = async (req, res, next) => {
    const payload = req.body;

    try {

        const isDuplicate = await User.exists({ email: payload.email });
        if(isDuplicate) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        payload.password = await bcrypt.hash(payload.password, 10);

        const newUser = await User.create(payload);
        res.status(201).json(newUser);
    } catch (error) {
       next(error);
    }

};

exports.login = async (req, res, next) => {
    const payload = req.body;

    const user = await User.findOne({ email: payload.email });

    if(!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    
    if(!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    var token = jwt.sign({ id: user._id, email: user.email }, 'abcdef1234567890', { expiresIn: '5m' });
    
    res.status(200).json({ token });
};

exports.userProfile = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    return res.status(200).json({ user });
};