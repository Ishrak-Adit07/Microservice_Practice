import redis from 'redis';
const publisher = redis.createClient();

// publisher.publish('channel', 'message');

export { publisher };