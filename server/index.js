const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json({ limit: 100000000 }));
app.use(
  cors({
    origin: "https://spoonacular-client.vercel.app/",
    methodes: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://saricjerko86:sp4lYkDht1HJ6CZ1@cluster0.cqft3jc.mongodb.net/",
  { dbName: "Spoonacular" }
);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (res) => {
  res.json("Hello");
});

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const imagesRouter = require("./routes/images");
app.use("/images", imagesRouter);

app.listen(5000, () => console.log("Server started listening on port 5000"));
