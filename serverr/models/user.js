const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: "String",
  },
  email: {
    type: "String",
  },
  userData: {
    status: {
      type: "String",
    },
    username: {
      type: "String",
    },
    spoonacularPassword: {
      type: "String",
    },
    hash: {
      type: "String",
    },
  },
  favorites: {
    type: ["Mixed"],
  },
  shopingLists: {
    type: ["Mixed"],
  },
  images: {
    type: ["Mixed"],
  },
});

module.exports = mongoose.model("User", userSchema);
