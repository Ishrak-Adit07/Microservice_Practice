import { Payment } from "../models/payment.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

const makePayment = async (req, res) => {
  const { name, payment } = req.body;

  try {
    if (!name || !payment) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // const exist = await Payment.findOne({ name });
    // if (exist) {
    //   return res.status(409).send({ error: "Name is already in use" });
    // }

    const payment_done = await Payment.create({ name, payment });

    return res.status(201).send({ payment_done });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e.message });
  }
};

export { makePayment };