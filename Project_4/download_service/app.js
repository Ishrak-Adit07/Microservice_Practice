import express from "express";
const app = express();

// For parsing json
app.use(express.json());

// For cors
import cors from "cors";
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

import mongoose from "mongoose";
import { mongodbURL } from "./config.js";

console.log("Trying to start mongodb");

mongoose
  .connect(mongodbURL, { dbName: "dfsa" })
  .then(() => {
    console.log("App connected to database");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    console.log(err);
  });

import { subscriber } from "./event_handlers/redis.sub.js";
console.log("Subscribing to auth channel");
subscriber.subscribe("auth_channel");

//Importing the routes
import downloadRoute from "./routes/download.route.js";
app.use("/api/download", downloadRoute);

//Default URL
app.use("/", (req, res) => {
  res.send("Invalid URL!");
});

export default app;
