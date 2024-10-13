import express from "express";
import { makeDownload } from "../controllers/download.controller.js";
import auth from "../middlewares/auth.mw.js";
const router = express.Router();

router.post("/make", auth, makeDownload);
export default router;