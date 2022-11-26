const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//Routes
const authRoute = require("./routes/auth");

dotenv.config();

//DB Connection
mongoose.connect(process.env.DB_PASSWORD, () => {
  console.log("DB connected");
});

//Middleware
app.use(express.json());

//Route Middleware
app.use("/user", authRoute);

app.listen(5001, () => {
  console.log("running");
});
