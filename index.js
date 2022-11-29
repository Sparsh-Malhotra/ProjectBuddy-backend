const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//Routes
const authRoute = require("./routes/auth");

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

app.listen(5001, () => {
  console.log("running");
});
