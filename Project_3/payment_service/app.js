import express from "express";
const app = express();

// For parsing json
app.use(express.json());

// For cors
import cors from 'cors';
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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

connectToBroker();

//Importing the routes
import paymentRoute from "./routes/payment.route.js";
import { connectToBroker } from "./event_handlers/rmq.consumer.js";
app.use("/api/payment", paymentRoute);

//Default URL
app.use("/", (req, res) => {
  res.send("Invalid URL!");
});

export default app;