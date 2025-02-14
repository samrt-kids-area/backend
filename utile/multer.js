const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.memoryStorage(); // Store files in memory

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
