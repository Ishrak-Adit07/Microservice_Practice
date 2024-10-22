import express from "express";
import { makePayment, testPayment } from "../controllers/payment.controller.js";
import auth from "../middlewares/auth.mw.js";
const router = express.Router();

router.post("/make", auth, makePayment);
router.get("/test", testPayment);

export default router;