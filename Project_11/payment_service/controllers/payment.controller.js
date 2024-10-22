import { Payment } from "../models/payment.model.js";
import "dotenv/config.js";

const makePayment = async (req, res) => {
  const { name, payment } = req.body;

  try {
    if (!name || !payment) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const payment_done = await Payment.create({ name, payment });

    return res.status(201).send({ payment_done });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e.message });
  }
};

const testPayment = async (req, res) => {

  try {

    return res.status(201).send({ message: "Hello from payment service" });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e.message });
  }
};

export { makePayment, testPayment };