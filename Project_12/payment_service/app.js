import express from "express";
const app = express();
import pool from "./database/pool.js";

// For parsing json
app.use(express.json());

// For cors
import cors from "cors";
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Log when attempting to start PostgreSQL
console.log("Trying to connect to PostgreSQL");

// Check the PostgreSQL connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL pool");
  release(); // release the client back to the pool
});
//Importing the routes
import paymentRoute from "./routes/payment.route.js";
app.use("/api/payment", paymentRoute);

//Default URL
app.use("/", (req, res) => {
  res.send("Invalid URL!");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
