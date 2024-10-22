import amqp from 'amqplib';
import { Payment } from '../models/payment.model';

async function connectToRabbitMQ() {
  const amp_url = process.env.RABBITMQ_URL || 'amqp://rabbitmq-service:5672';

  try {
    const connection = await amqp.connect(amp_url);
    const channel = await connection.createChannel();
    const queue = 'user_events';

    await channel.assertQueue(queue, { durable: true });

    console.log("Connected to RabbitMQ, listening for messages...");

    channel.consume(queue, async (message) => {
      if (message !== null) {
        try {
          const eventData = JSON.parse(message.content.toString());

          // Process the event
          if (eventData.type === 'USER_REGISTERED') {
            console.log("Handling user registered event:", eventData);

            // Example action: Creating a payment record
            await Payment.create({
              name: eventData.username || "Unknown",
              payment: 110 // Example static payment value, change if needed
            });

            channel.ack(message); // Acknowledge successful processing
          }
        } catch (error) {
          console.error('Error processing message:', error);
          channel.nack(message, false, true); // Reject and requeue message
        }
      }
    });

    return { connection, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
}

async function consumeEvents() {
  let connected = false;

  while (!connected) {
    try {
      await connectToRabbitMQ();
      connected = true;
    } catch (error) {
      console.error("Failed to connect to RabbitMQ. Retrying in 5 seconds...");
      await new Promise(resolve => setTimeout(resolve, 5000)); // Retry after 5 seconds
    }
  }
}

export { consumeEvents };