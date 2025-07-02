const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  encoding: {
    type: [Number],
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
  },
  entryTime: {
    type: Date,
    default: null,
  },
  duration: {
    type: Number, // بالـ minutes
    default: 0,
  },
  expectedCheckOutTime: {
    type: Date,
    default: null,
  },
  actualCheckOutTime: {
    type: Date,
    default: null,
  },
});

const Child = mongoose.model("Children", childSchema);

module.exports = Child;
