import Redis from 'ioredis';

const redisClient = new Redis.Cluster([
  {
    host: process.env.REDIS_HOST || 'redis-cluster',
    port: 6379,
  },
]);

export default redisClient;