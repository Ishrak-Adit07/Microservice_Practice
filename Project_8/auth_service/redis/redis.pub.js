import redisClient from "./redis.client";

// Function to publish an event to Redis
const publishEvent = (channel, message) => {
  redisClient.publish(channel, JSON.stringify(message), (err, reply) => {
    if (err) {
      console.error("Failed to publish event", err);
    } else {
      console.log(`Event published to channel ${channel}:`, message);
    }
  });
};

// Example usage
// const event = {
//   type: 'user_logged_in',
//   userId: '12345',
//   timestamp: Date.now(),
// };
// publishEvent('user_events', event);

export { publishEvent };
