const AdminModel = require('../model/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const sendEmail = require('../utile/sendEmail');
const asyncErrorPattern = require("../middleware/asyncError");

const createAdmin = asyncErrorPattern(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const admin = await AdminModel.findOne({ email });
    if (admin) return res.status(400).json({ success: false, message: "Admin already exists" });

    const emailToken = crypto.randomBytes(20).toString("hex");
    const emailVerificationUrl = `${process.env.FRONTEND_URL}/verify/email/${emailToken}`;
    const message = `Please Verify your email by clicking at this link :- \n\n ${emailVerificationUrl} \n\n.`;

    await sendEmail({
        email: email,
        subject: `Smart kids Area Email Verification`,
        message,
    });

    const newAdmin = new AdminModel({ name, email, password, role, verifyEmailToken: emailToken });
    await newAdmin.save();
    res.status(201).json({ success: true, admin: newAdmin });
})

const loginAdmin = asyncErrorPattern(async (req, res) => {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });
    if (!admin) return res.status(400).json({ success: false, message: "Admin not found" });

    const isPasswordMatched = await admin.comparePassword(password);

    if (!isPasswordMatched) return res.status(400).json({ success: false, message: "Invalid password" });

    const token = admin.getJWTToken();

    res.status(200).json({ success: true, admin, token });
})

const verifyEmail = asyncErrorPattern(async (req, res) => {
    const { emailToken } = req.params;
    const admin = await AdminModel.findOne({ verifyEmailToken: emailToken });
    if (!admin) return res.status(400).json({ success: false, message: "Admin not found" });

    admin.isEmailVerified = true;
    admin.verifyEmailToken = null;
    await admin.save();

    res.status(200).json({ success: true, message: "Email verified successfully" });
})

const deleteAdmin = asyncErrorPattern(async (req, res) => {
    const admin = await AdminModel.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(400).json({ success: false, message: "Admin not found" });
    res.status(200).json({ success: true, message: "Admin deleted successfully" });
})

module.exports = { createAdmin, loginAdmin, verifyEmail, deleteAdmin };