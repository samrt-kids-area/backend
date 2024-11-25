const ParentModel = require('../model/Parent');
const asyncErrorPattern = require("../middleware/asyncError");

const createParent = asyncErrorPattern(async (req, res, next) => {
    const parentExists = await ParentModel.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });

    if (parentExists.email === req.body.email)
        return res.status(401).json({ success: false, message: "Parent with this email already exists" });

    if (parentExists.phone === req.body.phone)
        return res.status(401).json({
            success: false, message: "Parent with this phone already exists"
        });

    const parent = new ParentModel(req.body);
    await parent.save();
    res.status(201).send(parent);
})

// handle all crud operations here 
const updateParent = asyncErrorPattern(async (req, res, next) => {
    const parent = await ParentModel.findById(req.params.id);
    if (!parent) {
        return res.status(404).json({ success: false, message: "Parent not found" });
    }
    // plz change this logic to update only the fields that are passed in the request body

    Object.keys(req.body).forEach(key => {
        parent[key] = req.body[key];
    });

    await parent.save();
    res.status(200).json({ success: true, message: "Parent updated successfully" });
})

const deleteParent = asyncErrorPattern(async (req, res, next) => {
    const parent = await ParentModel.findById(req.params.id);
    if (!parent) {
        return res.status(404).json({ success: false, message: "Parent not found" });
    }
    await parent.remove();
    res.status(200).json({ success: true, message: "Parent deleted successfully" });
})

const getAllParents = asyncErrorPattern(async (req, res, next) => {
    const parents = await ParentModel.find();
    res.status(200).json({ success: true, parents });
})

const getParent = asyncErrorPattern(async (req, res, next) => {
    /// want to get data of children as well
    // want all data and childe also
    const parent = await ParentModel.findById(req.params.id).populate('children');
    if (!parent) {
        return res.status(404).json({ success: false, message: "Parent not found" });
    }
    res.status(200).json({ success: true, parent });
})

module.exports = { createParent, updateParent, deleteParent, getAllParents, getParent };
