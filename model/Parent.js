const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ParentSchema = new Schema({
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
  photo: {
    type: String,
    required: true,
  },
  photoData: {
    type: [String],
    required: true,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "children",
    },
  ],
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Parent", ParentSchema);
