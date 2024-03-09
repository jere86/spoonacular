const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
// const usersRouter = require("./routes/users");
// const imagesRouter = require("./routes/images");

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Database connection
mongoose.connect(
  "mongodb+srv://saricjerko86:sp4lYkDht1HJ6CZ1@cluster0.cqft3jc.mongodb.net/Spoonacular",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

// Routes
app.get("/", (req, res) => {
  res.json("Hello");
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/users/:id", getUser, (req, res) => {
  res.json(res.user);
});

app.post("/users", async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    userData: req.body.userData,
    favorites: req.body.favorites,
    shopingLists: req.body.shopingLists,
    images: req.body.images,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch("/users/:id", getUser, async (req, res) => {
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
  if (req.body.images != null) {
    res.user.images = req.body.images;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/users/:id", getUser, async (req, res) => {
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

// app.use("/users", usersRouter);
// app.use("/images", imagesRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started listening on port ${PORT}`));
