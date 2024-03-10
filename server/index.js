const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const imagesRouter = require("./routes/images");

const app = express();

// Middleware
app.use(
  express.json({
    limit: "100mb",
  })
);

const whitelist = ["https://spoonacular-client.vercel.app"];
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
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    corsOptions.origin(req.header("Origin"))
  );
});

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Database connection
const uri =
  "mongodb+srv://saricjerko86:sp4lYkDht1HJ6CZ1@cluster0.cqft3jc.mongodb.net/Spoonacular?retryWrites=true&w=majority";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));

// Routes
app.get("/", (req, res) => {
  res.json("Hello");
});

app.use("/users", usersRouter);
app.use("/images", imagesRouter);

// Middleware for error handling
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something went wrong.");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started listening on port ${PORT}`);
});

// Close the MongoDB connection on process exit
process.on("exit", () => {
  db.close();
});
