import amqp from 'amqplib';

let channel = null;

// Function to connect to RabbitMQ and create a channel
async function createChannel() {
  if (channel) {
    return channel;
  }

  try {
    const amp_url = process.env.RABBITMQ_URL || 'amqp://rabbitmq-service:5672';
    const connection = await amqp.connect(amp_url);
    channel = await connection.createChannel();

    console.log("RabbitMQ channel created");

    return channel;
  } catch (error) {
    console.error("Error creating RabbitMQ channel:", error);
    throw error;
  }
}

// Function to publish an event
async function publishEvent(eventData) {
  try {
    const queue = 'user_events';
    const channel = await createChannel();

    // Assert the queue to make sure it exists
    await channel.assertQueue(queue, { durable: true });

    // Send the message to the queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(eventData)));

    console.log("Event Published:", eventData);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
}

export { publishEvent, createChannel };