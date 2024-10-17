import amqp from "amqplib/callback_api.js";
// import { createPaymentProfile } from "./controllers/payment.controller.js"; // Uncomment to handle the event

let channel = null;
let connection = null;

// Connect to RabbitMQ
const connectToBroker = () => {
  const rabbitMqUrl = process.env.RABBITMQ_URL || "amqp://localhost"; // Use environment variable or fallback to localhost for local dev

  amqp.connect(rabbitMqUrl, (error0, conn) => {
    if (error0) {
      console.error("Failed to connect to RabbitMQ", error0);
      return setTimeout(connectToBroker, 5000); // Retry connection after a delay
    }
    connection = conn;
    console.log("Connected to RabbitMQ");

    // Create a channel
    connection.createChannel((error1, ch) => {
      if (error1) {
        console.error("Failed to create RabbitMQ channel", error1);
        return;
      }
      channel = ch;

      const queue = "user_logged_in";

      // Assert the queue exists
      channel.assertQueue(queue, { durable: true });
      console.log(`Waiting for messages in queue: ${queue}`);

      // Start consuming messages from the queue
      channel.consume(
        queue,
        (msg) => {
          if (msg !== null) {
            const event = JSON.parse(msg.content.toString());
            console.log("Received event:", event);

            // Handle the event (implement your logic here)
            // createPaymentProfile(event);

            // Acknowledge that the message has been successfully processed
            channel.ack(msg);
          }
        },
        { noAck: false } // Acknowledge messages manually
      );
    });
  });

  // Handle connection close or error
  connection.on("close", () => {
    console.error("RabbitMQ connection closed, reconnecting...");
    setTimeout(connectToBroker, 5000); // Reconnect after 5 seconds
  });

  connection.on("error", (err) => {
    console.error("RabbitMQ connection error", err);
    setTimeout(connectToBroker, 5000); // Reconnect on error
  });
};

// Graceful shutdown: Close RabbitMQ connection before exiting the process
const closeConnection = () => {
  if (connection) {
    connection.close(() => {
      console.log("RabbitMQ connection closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Handle shutdown signals (SIGINT, SIGTERM)
process.on("SIGINT", closeConnection);
process.on("SIGTERM", closeConnection);

export { connectToBroker };