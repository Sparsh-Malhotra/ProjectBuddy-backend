import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

/////////////////
// Routes
/////////////////

import authRoute from "./routes/auth.js";
import userDetailsRoute from "./routes/userDetails.js";
import consoleRoute from "./routes/console.js";
import chatRoute from "./routes/chat.js";
import messageRoute from "./routes/message.js";

const app = express();
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
  const allowedOrigins = [
    "http://localhost:3000",
    "https://project-buddy.live",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
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
app.use("/chat", chatRoute);
app.use("/message", messageRoute);

app.listen(5001, () => {
  console.log("running");
});
