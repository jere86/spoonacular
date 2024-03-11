const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const usersRouter = require("./routes/users");
const imagesRouter = require("./routes/images");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));

const whitelist = [
  "https://spoonacular-client.vercel.app",
  "https://spoonacular-client.vercel.app/users",
  "https://spoonacular-client.vercel.app/images",
  "https://localhost:3000",
  "https://localhost:3000/users",
  "https://localhost:3000/images",
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

const specificCorsOptions = {
  methods: ["POST", "GET", "PATCH", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.options("/users", cors(specificCorsOptions));
app.use("/users", cors(specificCorsOptions), usersRouter);

app.options("/images", cors(specificCorsOptions));
app.use("/images", cors(specificCorsOptions), imagesRouter);

// Database connection
mongoose.connection.on("error", (error) => {
  console.error(`MongoDB connection error: ${error.message}`);
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

app.use("/users", usersRouter);
app.use("/images", imagesRouter);

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
