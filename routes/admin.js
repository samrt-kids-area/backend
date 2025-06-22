const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
  createAdmin,
  deleteAdmin,
  loginAdmin,
  verifyEmail,
  getAdminInfo,
  getAllAdmins,
} = require("../controller/adminController");
const adminValidationMW = require("../middleware/adminValidationMW");
const { authenticated } = require("../middleware/auth");

router.post("/create-admin", createAdmin);
router.delete("/delete-admin/:id", deleteAdmin);
// verify email
router.get("/verify/email/:emailToken", verifyEmail);
router.post("/login", loginAdmin);
router.get("/info", authenticated, getAdminInfo);
router.get("/get-all-admins", getAllAdmins);

module.exports = router;
