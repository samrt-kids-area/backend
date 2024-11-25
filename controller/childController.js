const asyncErrorPattern = require("../middleware/asyncError");
const ChildModel = require('../model/Children');
const ParentModel = require('../model/Parent');


const createChild = asyncErrorPattern(async (req, res, next) => {
    const parent = await ParentModel.findById(req.params.id);
    if (!parent) {
        return res.status(404).json({ success: false, message: "Parent not found" });
    }
    const child = new ChildModel(req.body);
    parent.children.push(child._id);
    await parent.save();
    await child.save();
    res.status(201).send(child);
})

const updateChild = asyncErrorPattern(async (req, res, next) => {
    const child = await ChildModel.findById(req.params.id);
    if (!child) {
        return res.status(404).json({ success: false, message: "Child not found" });
    }

    Object.keys(req.body).forEach(key => {
        child[key] = req.body[key];
    });
    await child.save();
    res.status(200).json({ success: true, child });
})

const deleteChild = asyncErrorPattern(async (req, res, next) => {
    const child = await ChildModel.findById(req.params.id);
    if (!child) {
        return res.status(404).json({ success: false, message: "Child not found" });
    }
    await child.remove();
    res.status(200).json({ success: true, message: "Child deleted successfully" });
})

const getChild = asyncErrorPattern(async (req, res, next) => {
    const child = await ChildModel.findById(req.params.id);
    if (!child) {
        return res.status(404).json({ success: false, message: "Child not found" });
    }
    res.status(200).json({ success: true, child });
})

const getAllChildren = asyncErrorPattern(async (req, res, next) => {
    const children = await ChildModel.find();
    res.status(200).json({ success: true, children });
})

module.exports = { createChild, updateChild, deleteChild, getAllChildren, getChild };
