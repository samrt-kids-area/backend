const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
  createChild,
  updateChild,
  deleteChild,
  getAllChildren,
  getChild,
} = require("../controller/childController");

router.post("/create-child/:id", upload.single("photo"), createChild);
router.get("/get-child/:id", getChild);
router.put("/update-child/:id", upload.single("photo"), updateChild);
router.delete("/delete-child/:id", deleteChild);
router.get("/get-all-children", getAllChildren);

module.exports = router;
