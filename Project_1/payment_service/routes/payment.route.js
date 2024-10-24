import express from "express";
import { makePayment } from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/make", makePayment);

export default router;