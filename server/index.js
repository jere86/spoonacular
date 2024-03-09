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

mongoose.connect(
  "mongodb+srv://saricjerko86:sp4lYkDht1HJ6CZ1@cluster0.cqft3jc.mongodb.net/Spoonacular",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

app.get("/users", (req, res, next) => {
  res.set(
    "Access-Control-Allow-Origin",
    "https://spoonacular-client.vercel.app"
  );
  res.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/images", (req, res, next) => {
  res.set(
    "Access-Control-Allow-Origin",
    "https://spoonacular-client.vercel.app"
  );
  res.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res) => {
  res.json("Hello");
});

app.use("/users", usersRouter);
app.use("/images", imagesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started listening on port ${PORT}`));
