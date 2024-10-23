const { Pool } = require("pg"); // Make sure to import the Pool class from the 'pg' module

// Create a new pool using the provided connection parameters
const pool = new Pool({
  connectionString: `postgresql://doadmin:${process.env.POSTGRES_PASSWORD}@template-pg-do-user-18003520-0.g.db.ondigitalocean.com:25061/template-pool?sslmode=require`,
  ssl: {
    rejectUnauthorized: false, // Adjust based on your SSL requirements
    require: true, // This indicates that SSL is required
  },
});

// Export the pool for use in your application
module.exports = pool;
