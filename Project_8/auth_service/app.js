import express from "express";
const app = express();

// For parsing json
app.use(express.json());

// For cors
import cors from "cors";
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

import mongoose from "mongoose";
import { mongodbURL } from "./config.js";
import { createChannel } from "./event_handler/rmq.pub.js";

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

(async () => {
  try {
    await createChannel();
  } catch (err) {
    console.log(err);
  }
})();

//Importing the routes
import userRoute from "./routes/user.route.js";
app.use("/api/user", userRoute);

//Default URL
app.use("/", (req, res) => {
  console.log("Inside the default url! :(");
  res.status(500).send("Invalid URL!");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
