import express from "express";
import { makePayment } from "../controllers/payment.controller.js";
import auth from "../middlewares/auth.mw.js";
const router = express.Router();

router.post("/make", auth, makePayment);

export default router;