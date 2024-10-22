import { Kafka } from 'kafkajs';

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'my-app', // A unique identifier for your application
  brokers: ['kafka-service:9092'],  // Replace with your Kafka service name and port
});

// Create a Kafka producer
const producer = kafka.producer();

// Function to send messages to a Kafka topic
export const sendMessage = async (topic, message) => {
  try {
    // Connect the producer to Kafka
    await producer.connect();

    // Send a message to the specified topic
    await producer.send({
      topic,  // Kafka topic where the message will be sent
      messages: [{ value: message }],  // The message payload
    });

    console.log(`Message sent to topic ${topic}`);
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    // Disconnect the producer when done
    await producer.disconnect();
  }
};