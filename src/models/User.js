const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, email: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: '' },
    refreshTokenExpiry: { type: Date, default: null },
    resetPasswordCode: { type: String, default: null },
    resetPasswordCodeExpiry: { type: Date, default: null },
    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;