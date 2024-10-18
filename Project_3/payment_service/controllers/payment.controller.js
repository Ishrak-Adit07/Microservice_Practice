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

export const createPaymentProfile = async (event) => {
  try {
    //const { userId, paymentAmount, paymentMethod } = event;

    // Create a new payment record in the database
    const newPayment = await Payment.create({
      name: "Jon Snow", 
      payment: 990
    });

    console.log("Payment profile created successfully:", newPayment);
  } catch (error) {
    console.error("Error creating payment profile:", error);
  }
};

export { makePayment, createPaymentProfile };