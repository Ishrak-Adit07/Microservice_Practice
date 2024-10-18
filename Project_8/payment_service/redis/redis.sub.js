import { Payment } from "../models/payment.model";
import redisClient from "./redis.client";

// Subscribe to a Redis channel
redisClient.subscribe("user_events", (err, count) => {
  if (err) {
    console.error("Failed to subscribe to channel", err);
  } else {
    console.log(`Subscribed to ${count} channel(s). Waiting for messages...`);
  }
});

// Listen for messages on the subscribed channel
redisClient.on("message", async (channel, message) => {
  console.log(`Received message from channel ${channel}:`, message);

  const event = JSON.parse(message);

  // Handle the event (you can add business logic here)
  if (event.type === "user_logged_in") {
    console.log(`User logged in: ${event.name}`);

    try {
      // Create the payment record in the database
      const payment_done = await Payment.create({
        name: "Jon Snow", // This can be dynamic if needed
        payment: 110,
      });
      console.log("Payment profile created successfully:", payment_done);
    } catch (error) {
      console.error("Error creating payment profile:", error);
    }
  }
});