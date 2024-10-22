import { Kafka } from 'kafkajs';

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'my-app', // A unique identifier for your application
  brokers: ['kafka-service:9092'],  // Replace with your Kafka service name and port
});

// Create a Kafka consumer
const consumer = kafka.consumer({ groupId: 'my-group' });

// Function to consume messages from a Kafka topic
export const consumeMessages = async (topic) => {
  try {
    // Connect the consumer to Kafka
    await consumer.connect();

    // Subscribe to a topic to start receiving messages
    await consumer.subscribe({ topic, fromBeginning: true });

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message from topic ${topic}: ${message.value.toString()}`);
        // Add any logic here to handle the message
      },
    });

    console.log(`Consumer subscribed to topic ${topic}`);
  } catch (error) {
    console.error('Error consuming message:', error);
  }
};