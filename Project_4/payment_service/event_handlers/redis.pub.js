import redis from "redis";

const publisher = redis.createClient({
  url: process.env.REDIS_URL,
});

try {
  await publisher.connect();
} catch (error) {
  console.error("Error connecting to Redis:", error);
}

// Example of publishing a message (uncomment to use)
// await publisher.publish('channel', 'message');

export { publisher };