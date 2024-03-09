const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const imagesRouter = require("./routes/images");

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

app.use("/users", usersRouter);
app.use("/images", imagesRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started listening on port ${PORT}`));
