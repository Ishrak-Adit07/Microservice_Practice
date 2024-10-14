import redis from 'redis';

const subscriber = redis.createClient({
  url: process.env.REDIS_URL
});

try {
  await subscriber.connect();

  await subscriber.subscribe('payment_channel', (message) => {
    console.log(`Received message: ${message} from channel: payment_channel`);
  });

  await subscriber.subscribe('download_channel', (message) => {
    console.log(`Received message: ${message} from channel: download_channel`);
  });

} catch (error) {
  console.error('Error connecting to Redis or subscribing to channels:', error);
}

export { subscriber };