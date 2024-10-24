// Redis Client Setup (redis-client.js)
const Redis = require('ioredis');
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

// Rate Limiter Middleware (middlewares/rateLimiter.js)
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const createRateLimiter = () => rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate-limit:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

// Waiting Room Service (services/waitingRoom.js)
class WaitingRoomService {
  constructor(redis) {
    this.redis = redis;
    this.ROOM_CAPACITY = 50000;
    this.PROCESSING_RATE = 5000; // users per minute
  }

  async enterWaitingRoom(userId) {
    const position = await this.redis.incr('waiting-room:count');
    if (position <= this.ROOM_CAPACITY) {
      await this.redis.zadd('waiting-room:queue', Date.now(), userId);
      return position;
    }
    throw new Error('Waiting room is full');
  }

  async checkUserTurn(userId) {
    const score = await this.redis.zscore('waiting-room:queue', userId);
    if (!score) return false;
    
    const rank = await this.redis.zrank('waiting-room:queue', userId);
    const timeInQueue = Date.now() - score;
    const allowedRank = Math.floor(timeInQueue * (this.PROCESSING_RATE / (60 * 1000)));
    
    return rank <= allowedRank;
  }
}

// Cache Service (services/cache.js)
class CacheService {
  constructor(redis) {
    this.redis = redis;
    this.LOCK_TIMEOUT = 10; // seconds
  }

  async getInventory(trainId, date) {
    const key = `inventory:${trainId}:${date}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async setInventory(trainId, date, inventory) {
    const key = `inventory:${trainId}:${date}`;
    await this.redis.set(key, JSON.stringify(inventory), 'EX', 3600); // 1 hour expiry
  }

  async acquireLock(key) {
    return await this.redis.set(`lock:${key}`, '1', 'NX', 'EX', this.LOCK_TIMEOUT);
  }

  async releaseLock(key) {
    await this.redis.del(`lock:${key}`);
  }
}

// Ticket Service (services/ticket.js)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // maximum number of clients in the pool
});

class TicketService {
  constructor(cacheService, waitingRoomService) {
    this.cacheService = cacheService;
    this.waitingRoomService = waitingRoomService;
    this.pool = pool;
  }

  async checkAvailability(userId, trainId, date) {
    // Check waiting room status
    const isUsersTurn = await this.waitingRoomService.checkUserTurn(userId);
    if (!isUsersTurn) {
      throw new Error('Please wait in the waiting room');
    }

    // Try cache first
    let inventory = await this.cacheService.getInventory(trainId, date);
    
    if (!inventory) {
      // Cache miss - fetch from database
      const client = await this.pool.connect();
      try {
        const result = await client.query(
          'SELECT available_seats, price FROM train_inventory WHERE train_id = $1 AND journey_date = $2',
          [trainId, date]
        );
        inventory = result.rows[0];
        // Cache the result
        await this.cacheService.setInventory(trainId, date, inventory);
      } finally {
        client.release();
      }
    }

    return inventory;
  }

  async reserveTicket(userId, trainId, date) {
    const lockKey = `${trainId}:${date}`;
    
    // Acquire distributed lock
    if (!await this.cacheService.acquireLock(lockKey)) {
      throw new Error('Reservation in progress');
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Check inventory with FOR UPDATE lock
      const result = await client.query(
        `SELECT available_seats FROM train_inventory 
         WHERE train_id = $1 AND journey_date = $2 
         FOR UPDATE`,
        [trainId, date]
      );

      if (!result.rows[0] || result.rows[0].available_seats <= 0) {
        throw new Error('No seats available');
      }

      // Update inventory
      await client.query(
        `UPDATE train_inventory 
         SET available_seats = available_seats - 1 
         WHERE train_id = $1 AND journey_date = $2`,
        [trainId, date]
      );

      // Create reservation
      const reservationResult = await client.query(
        `INSERT INTO reservations (user_id, train_id, journey_date) 
         VALUES ($1, $2, $3) RETURNING id`,
        [userId, trainId, date]
      );

      await client.query('COMMIT');

      // Update cache
      const updatedInventory = await this.checkAvailability(userId, trainId, date);
      await this.cacheService.setInventory(trainId, date, updatedInventory);

      return { reservationId: reservationResult.rows[0].id };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
      await this.cacheService.releaseLock(lockKey);
    }
  }
}

// API Routes (routes/tickets.js)
const express = require('express');
const router = express.Router();

const cacheService = new CacheService(redis);
const waitingRoomService = new WaitingRoomService(redis);
const ticketService = new TicketService(cacheService, waitingRoomService);

router.get('/availability/:trainId/:date', async (req, res) => {
  try {
    const { trainId, date } = req.params;
    const userId = req.user.id; // Assuming auth middleware sets this

    const inventory = await ticketService.checkAvailability(userId, trainId, date);
    res.json(inventory);
  } catch (error) {
    res.status(429).json({ error: error.message });
  }
});

router.post('/reserve/:trainId/:date', async (req, res) => {
  try {
    const { trainId, date } = req.params;
    const userId = req.user.id;

    const reservation = await ticketService.reserveTicket(userId, trainId, date);
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Kubernetes Configuration (k8s/redis-deployment.yaml)
// apiVersion: apps/v1
// kind: Deployment
// metadata:
//   name: redis-cache
// spec:
//   replicas: 3
//   selector:
//     matchLabels:
//       app: redis-cache
//   template:
//     metadata:
//       labels:
//         app: redis-cache
//     spec:
//       containers:
//       - name: redis
//         image: redis:6.2-alpine
//         ports:
//         - containerPort: 6379
//         resources:
//           limits:
//             memory: "1Gi"
//             cpu: "500m"
//           requests:
//             memory: "512Mi"
//             cpu: "250m"