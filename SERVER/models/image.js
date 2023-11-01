const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  images: {
    type: ["Mixed"],
  },
  user: {
    type: "String",
  },
});

module.exports = mongoose.model("Image", imageSchema);
