import "dotenv/config.js";
import {pool} from '../database/pool.js';

const makePayment = async (req, res) => {
  const { name, payment } = req.body;

  try {
    if (!name || !payment) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Use a database query to insert the payment record
    const result = await pool.query(
      'INSERT INTO payments (name, payment) VALUES ($1, $2) RETURNING *',
      [name, payment]
    );

    const payment_done = result.rows[0]; // Get the inserted payment record

    return res.status(201).send({ payment_done });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e.message });
  }
};

export { makePayment };