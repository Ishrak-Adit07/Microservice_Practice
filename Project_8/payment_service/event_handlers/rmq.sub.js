import amqp from 'amqplib';
import { Payment } from '../models/payment.model';

async function consumeEvents() {
  try {
    // Use the RabbitMQ service name and port in Kubernetes
    const amp_url = process.env.RABBITMQ_URL || 'amqp://rabbitmq-service:5672';
    const connection = await amqp.connect(amp_url);
    const channel = await connection.createChannel();

    const queue = 'user_events';

    // Assert the queue to ensure it exists and is durable
    await channel.assertQueue(queue, { durable: true });

    // Start consuming messages from the queue
    channel.consume(queue, async (message) => {
      if (message !== null) {
        try {
          const eventData = JSON.parse(message.content.toString());

          // Process the event
          if (eventData.type === 'USER_REGISTERED') {
            // Handle the event (e.g., user registration)
            console.log("Handling user registered event:", eventData);

            // Example action: Creating a payment record
            await Payment.create({
              name: "Jon Snow", 
              payment: 110
            });

            channel.ack(message);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    });
  } catch (error) {
    console.error('Error consuming message:', error);
  }
}

export { consumeEvents };