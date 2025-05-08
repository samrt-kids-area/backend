const express = require("express");
const router = express.Router();
const {
  createParent,
  getParent,
  updateParent,
  deleteParent,
  getAllParents,
  getParentByEmailAndPassword,
  getParentByToken,
} = require("../controller/parentController");
const parentValidationMW = require("../middleware/parentValidationMW");
const multer = require("multer");
const upload = multer();

router.post(
  "/create-parent",
  upload.single("photo"),
  parentValidationMW,
  createParent
);
router.get("/get-parent/:id", getParent);
router.put("/update-parent/:id", upload.single("photo"), updateParent);
router.delete("/delete-parent/:id", deleteParent);
router.get("/get-all-parents", getAllParents);
router.get("/get-parent-by-token", getParentByToken);
router.post("/get-parent-by-email-and-password", getParentByEmailAndPassword);

module.exports = router;
