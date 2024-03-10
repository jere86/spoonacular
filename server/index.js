const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Image = require("./models/image");
const User = require("./models/user");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));

const whitelist = [
  "https://spoonacular-client.vercel.app",
  "https://spoonacular-client.vercel.app/users",
  "https://spoonacular-client.vercel.app/images",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "GET", "PATCH", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Database connection
const uri = `mongodb+srv://saricjerko86:sp4lYkDht1HJ6CZ1@cluster0.cqft3jc.mongodb.net/Spoonacular?retryWrites=true&w=majority`;

mongoose.connection.on("error", (error) => {
  console.error(`MongoDB connection error: ${error.message}`);
});

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server started listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json("Hello");
});

app.get("/images", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/images/:id", async (req, res) => {
  let image;
  try {
    image = await Image.findById(req.params.id);
    if (image == null) {
      return res.status(404).json({ message: "Cannot find image!" });
    }
  } catch (err) {
    return res.status(505).json({ message: err.message });
  }

  res.json(image);
});

app.post("/images", async (req, res) => {
  const image = new Image({
    images: req.body.images,
    user: req.body.user,
    comments: req.body.comments,
    title: req.body.title,
    description: req.body.description,
  });

  try {
    const newImage = await image.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch("/images/:id", async (req, res) => {
  let image;
  try {
    image = await Image.findById(req.params.id);
    if (image == null) {
      return res.status(404).json({ message: "Cannot find image!" });
    }
  } catch (err) {
    return res.status(505).json({ message: err.message });
  }

  if (req.body.comments != null) {
    image.comments = req.body.comments;
  }

  try {
    const updatedImage = await image.save();
    res.json(updatedImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/images/:id", async (req, res) => {
  let image;
  try {
    image = await Image.findById(req.params.id);
    if (image == null) {
      return res.status(404).json({ message: "Cannot find image!" });
    }
  } catch (err) {
    return res.status(505).json({ message: err.message });
  }

  try {
    await image.deleteOne();
    res.json({ message: "Image Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Define routes for users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/users/:id", async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user!" });
    }
  } catch (err) {
    return res.status(505).json({ message: err.message });
  }

  res.json(user);
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

app.patch("/users/:id", async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user!" });
    }
  } catch (err) {
    return res.status(505).json({ message: err.message });
  }

  if (req.body.username != null) {
    user.username = req.body.username;
  }
  if (req.body.email != null) {
    user.email = req.body.email;
  }
  if (req.body.userData != null) {
    user.userData = req.body.userData;
  }
  if (req.body.favorites != null) {
    user.favorites = req.body.favorites;
  }
  if (req.body.shopingLists != null) {
    user.shopingLists = req.body.shopingLists;
  }
  if (req.body.images != null) {
    user.images = req.body.images;
  }

  try {
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user!" });
    }
  } catch (err) {
    return res.status(505).json({ message: err.message });
  }

  try {
    await user.deleteOne();
    res.json({ message: "User Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: error.message });
});

// Close the MongoDB connection on process exit
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error.message);
  process.exit(1);
});
