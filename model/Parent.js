const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const parentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  verifyEmailToken: {
    type: String,
    default: null,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: String,
  },
  photoData: {
    type: [String],
    required: true,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "Children",
    },
  ],
  role: {
    type: String,
    default: "parent",
  },
  password: {
    type: String,
    required: true,
  },
});

parentSchema.methods.generateAuthToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("Parent", parentSchema);
