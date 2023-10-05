const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

router.post("/", async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    userData: req.body.userData,
    favorites: req.body.favorites,
    shopingLists: req.body.shopingLists,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.userData != null) {
    res.user.userData = req.body.userData;
  }
  if (req.body.favorites != null) {
    res.user.favorites = req.body.favorites;
  }
  if (req.body.shopingLists != null) {
    res.user.shopingLists = req.body.shopingLists;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user!" });
    }
  } catch (err) {
    return res.status(505).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;
