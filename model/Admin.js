

const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    verifyEmailToken: {
        type: String,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
});

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});
adminSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;