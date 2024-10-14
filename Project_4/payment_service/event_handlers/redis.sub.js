import redis from 'redis';
import { Payment } from '../models/payment.model';

const subscriber = redis.createClient({
  url: process.env.REDIS_URL
});

const handleUserLoggedIn = async () => {
  try {
    const name = "Jon Snow";
    const payment = 345;
    
    const payment_done = await Payment.create({ name, payment });
    console.log(`Payment record created: ${payment_done}`);
  } catch (e) {
    console.error('Error creating payment record:', e);
  }
};

try {
  await subscriber.connect();

  await subscriber.subscribe('auth_channel', async (message) => {
    console.log(`Received message: ${message} from channel: auth_channel`);
    await handleUserLoggedIn();
  });

  await subscriber.subscribe('download_channel', (message) => {
    console.log(`Received message: ${message} from channel: download_channel`);
  });
} catch (error) {
  console.error('Error connecting to Redis or subscribing to channels:', error);
}

export { subscriber };
