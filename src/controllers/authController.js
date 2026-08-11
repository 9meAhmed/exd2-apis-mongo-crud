require('dotenv').config();
const Joi = require('joi');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

    const refreshToken = generateRefreshToken();
    const tokenHash = generateRefreshTokenHash(refreshToken);
    await updateUserRefreshTokenHash(user, tokenHash);
    var token = generateUserAccessToken(user);
    
    res.status(200).json({ token, refreshToken: tokenHash });
};

exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];

    if(!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }


    const user = await User.findOne({ refreshToken });

    if(!user) {
        return res.status(401).json({
            message: "Invalid refresh token",
        });
    }

    if (user.refreshTokenExpiry < new Date()) {
        await clearUserRefreshTokenHash(user);
        return res.status(401).json({
            message: "Refresh token expired",
        });
    }

    const newRefreshToken = generateRefreshToken();
    const tokenHash = generateRefreshTokenHash(newRefreshToken);
    await updateUserRefreshTokenHash(user, tokenHash);
    var token = generateUserAccessToken(user);

    res.status(200).json({ token, refreshToken: tokenHash });
}

exports.userProfile = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    return res.status(200).json({ user });
};

const generateUserAccessToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION || '5m' });
}

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
}

const generateRefreshTokenHash = (refreshToken) => {
    return crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
}

const updateUserRefreshTokenHash = async (user, tokenHash) => {
    user.refreshToken = tokenHash;
    user.refreshTokenExpiry = new Date(Date.now() + 8 * 60 * 1000); // 8 minutes from now
    await user.save();
}

const clearUserRefreshTokenHash = async (user) => {
    user.refreshToken = '';
    user.refreshTokenExpiry = null;
    await user.save();
}