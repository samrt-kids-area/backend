const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { createAdmin, deleteAdmin, loginAdmin, verifyEmail } = require('../controller/adminController');
const adminValidationMW = require('../middleware/adminValidationMW');

router.post('/create-admin', adminValidationMW, createAdmin);
router.delete('/delete-admin/:id', deleteAdmin);
// verify email
router.get('/verify/email/:emailToken', verifyEmail);
router.get('/login', loginAdmin);

module.exports = router;
