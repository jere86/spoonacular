const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  images: {
    type: ["Mixed"],
  },
  user: {
    type: "String",
  },
  comments: {
    type: ["Mixed"],
  },
  title: {
    type: "String",
  },
  description: {
    type: "String",
  },
});

module.exports = mongoose.model("Image", imageSchema);
