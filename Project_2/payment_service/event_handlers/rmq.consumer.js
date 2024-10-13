import amqp from "amqplib/callback_api.js";
// import { createPaymentProfile } from "./controllers/payment.controller.js"; // Import a function to handle the event

const connectToBroker = () => {
  amqp.connect("amqp://localhost", (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const queue = "user_logged_in";

      channel.assertQueue(queue, { durable: true });
      console.log(`Waiting for messages in queue: ${queue}`);

      channel.consume(
        queue,
        (msg) => {
          const event = JSON.parse(msg.content.toString());
          console.log("Received event:", event);

        //   createPaymentProfile(event);

          channel.ack(msg);
        },
        { noAck: false }
      );
    });
  });
};

export { connectToBroker };