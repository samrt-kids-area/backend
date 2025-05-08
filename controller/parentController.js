const ParentModel = require("../model/Parent");
const asyncErrorPattern = require("../middleware/asyncError");
const upload = require("../utile/multer");
const cloudinary = require("../utile/cloudinary");
const sendEmail = require("../utile/sendEmail");
const { cache } = require("joi");

const createParent = asyncErrorPattern(async (req, res, next) => {
  const parentExists = await ParentModel.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });

  if (parentExists?.email === req.body.email)
    return res.status(401).json({
      success: false,
      message: "Parent with this email already exists",
    });

  if (parentExists?.phone === req.body.phone)
    return res.status(401).json({
      success: false,
      message: "Parent with this phone already exists",
    });

  let imageUrl = null;
  if (req.file) {
    const fileBuffer = req.file.buffer;
    const base64String = `data:${
      req.file.mimetype
    };base64,${fileBuffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "parents", // Folder in Cloudinary
    });
    imageUrl = result.secure_url; // URL of the uploaded image
  }

  const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();

  // Create parent with image URL
  const parentData = {
    ...req.body,
    photo: imageUrl, // Add the image URL to the parent data
    password: randomPassword,
  };

  const parent = new ParentModel(parentData);
  await parent.save();

  const message = `
    Welcome to Smart Kids Area!

    Your account has been created successfully.
    Here are your login details:

    Email: ${req.body.email}
    Password: ${randomPassword}

    You can log in here: ${process.env.FRONTEND_URL}/parent/login

    Thank you for joining us!
  `;
  try {
    await sendEmail({
      email: req.body.email,
      subject: `Your Smart Kids Area Account Details`,
      message,
    });
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
    });
  }
  res.status(201).send(parent);
});

// handle all crud operations here
const updateParent = asyncErrorPattern(async (req, res, next) => {
  const parent = await ParentModel.findById(req.params.id);
  if (!parent) {
    return res
      .status(404)
      .json({ success: false, message: "Parent not found" });
  }

  let imageUrl = null;
  if (req.file) {
    const fileBuffer = req.file.buffer;
    const base64String = `data:${
      req.file.mimetype
    };base64,${fileBuffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "parents", // Folder in Cloudinary
    });
    imageUrl = result.secure_url; // URL of the uploaded image
  }

  Object.keys(req.body).forEach((key) => {
    parent[key] = req.body[key];
  });

  parent.photo = imageUrl || parent.photo;

  await parent.save();
  res
    .status(200)
    .json({ success: true, message: "Parent updated successfully" });
});

const deleteParent = asyncErrorPattern(async (req, res, next) => {
  const parent = await ParentModel.findByIdAndDelete(req.params.id);
  if (!parent) {
    return res
      .status(404)
      .json({ success: false, message: "Parent not found" });
  }
  res
    .status(200)
    .json({ success: true, message: "Parent deleted successfully" });
});

const getAllParents = asyncErrorPattern(async (req, res, next) => {
  // handle search query here

  const parents = await ParentModel.find({
    $or: [
      { name: { $regex: req.query.search.trim(), $options: "i" } },
      { email: { $regex: req.query.search.trim(), $options: "i" } },
      { phone: { $regex: req.query.search.trim(), $options: "i" } },
    ],
  }).populate("children");

  res.status(200).json({ success: true, parents });

  /* const parents = await ParentModel.find();
    res.status(200).json({ success: true, parents }); */
});

const getParent = asyncErrorPattern(async (req, res, next) => {
  /// want to get data of children as well
  // want all data and childe also
  const parent = await ParentModel.findById(req.params.id).populate("children");
  if (!parent) {
    return res
      .status(404)
      .json({ success: false, message: "Parent not found" });
  }
  res.status(200).json({ success: true, parent });
});
// get parent by token
const getParentByToken = asyncErrorPattern(async (req, res, next) => {
  const parent = await ParentModel.findById(req.user.id).populate("children");
  if (!parent) {
    return res
      .status(404)
      .json({ success: false, message: "Parent not found" });
  }
  res.status(200).json({ success: true, parent });
});
// get parent by email and password
const getParentByEmailAndPassword = asyncErrorPattern(
  async (req, res, next) => {
    const parent = await ParentModel.findOne({
      email: req.body.email,
      password: req.body.password,
    }).populate("children");
    if (!parent) {
      return res
        .status(404)
        .json({ success: false, message: "Parent not found" });
    }
    res.status(200).json({ success: true, parent });
  }
);

module.exports = {
  createParent,
  updateParent,
  deleteParent,
  getAllParents,
  getParent,
  getParentByEmailAndPassword,
  getParentByToken,
};
