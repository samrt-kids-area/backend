const asyncErrorPattern = require("../middleware/asyncError");
const ChildModel = require("../model/Children");
const ParentModel = require("../model/Parent");
const cloudinary = require("../utile/cloudinary");

const createChild = asyncErrorPattern(async (req, res, next) => {
  console.log("req.body", req.body);
  const parent = await ParentModel.findById(req.params.id);
  console.log("parent", parent);

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
      folder: "children",
    });
    imageUrl = result.secure_url; // URL of the uploaded image
  }

  const child = new ChildModel({
    name: req.body.name,
    photo: imageUrl,
    parent: parent._id,
    encoding: req.body.encoding.split(","),
  });
  parent.children.push(child._id);
  await parent.save();
  await child.save();
  res.status(201).send({ imageUrl });
});

const updateChild = asyncErrorPattern(async (req, res, next) => {
  const child = await ChildModel.findById(req.params.id);
  if (!child) {
    return res.status(404).json({ success: false, message: "Child not found" });
  }

  let imageUrl = null;
  if (req.file) {
    const fileBuffer = req.file.buffer;
    const base64String = `data:${
      req.file.mimetype
    };base64,${fileBuffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "children", // Folder in Cloudinary
    });
    imageUrl = result.secure_url; // URL of the uploaded image
  }

  Object.keys(req.body).forEach((key) => {
    child[key] = req.body[key];
  });

  child.photo = imageUrl || child.photo;

  await child.save();
  res.status(200).json({ success: true, child });
});

const deleteChild = asyncErrorPattern(async (req, res, next) => {
  const child = await ChildModel.findByIdAndDelete(req.params.id);
  if (!child) {
    return res.status(404).json({ success: false, message: "Child not found" });
  }
  /* const parent = await ParentModel.findById(child.parent);
  parent.children = parent.children.filter(
    (childId) => childId.toString() !== child._id.toString()
  );
  await parent.save(); */
  res
    .status(200)
    .json({ success: true, message: "Child deleted successfully" });
});

const getChild = asyncErrorPattern(async (req, res, next) => {
  const child = await ChildModel.findById(req.params.id);
  if (!child) {
    return res.status(404).json({ success: false, message: "Child not found" });
  }
  res.status(200).json({ success: true, child });
});

const getAllChildren = asyncErrorPattern(async (req, res, next) => {
  const children = await ChildModel.find({
    $or: [
      { name: { $regex: req.query.search.trim(), $options: "i" } },
      { email: { $regex: req.query.search.trim(), $options: "i" } },
      { phone: { $regex: req.query.search.trim(), $options: "i" } },
    ],
  })
    .populate("parent", "name")
    .select("-__v");

  res.status(200).json({ success: true, children });
});

module.exports = {
  createChild,
  updateChild,
  deleteChild,
  getAllChildren,
  getChild,
};
