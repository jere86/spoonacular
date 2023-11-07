const express = require("express");
const Image = require("../models/image");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getImage, (req, res) => {
  res.json(res.image);
});

router.post("/", async (req, res) => {
  const images = new Image({
    images: req.body.images,
    user: req.body.user,
    comments: req.body.comments,
  });

  try {
    const newImages = await images.save();
    res.status(201).json(newImages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", getImage, async (req, res) => {
  if (req.body.comments != null) {
    res.image.comments = req.body.comments;
  }
  try {
    const updatedImage = await res.image.save();
    res.json(updatedImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", getImage, async (req, res) => {
  try {
    await res.image.deleteOne();
    res.json({ message: "Image Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getImage(req, res, next) {
  let image;
  try {
    image = await Image.findById(req.params.id);
    if (image == null) {
      return res.status(404).json({ message: "Cannot find image!" });
    }
  } catch (err) {
    return res.status(505).json({ message: err.message });
  }

  res.image = image;
  next();
}

module.exports = router;
