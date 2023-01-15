const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
//Routes
const authRoute = require("./routes/auth");
const userDetailsRoute = require("./routes/userDetails");
const consoleRoute = require("./routes/console");

dotenv.config();

//DB Connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_PASSWORD);

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDatabase();

//Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: true, exposedHeaders: "*" }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Route Middleware
app.use("/user", authRoute);
app.use("/dashboard", userDetailsRoute);
app.use("/console", consoleRoute);

app.listen(5001, () => {
  console.log("running");
});
