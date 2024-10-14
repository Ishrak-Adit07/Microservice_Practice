import redis from 'redis';
const subscriber = redis.createClient();

// subscriber.subscribe('myChannel');
// subscriber.on('message', (channel, message) => {
//   console.log(`Received message: ${message} from channel: ${channel}`);
// });

export { subscriber };