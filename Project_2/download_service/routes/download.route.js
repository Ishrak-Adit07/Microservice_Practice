import express from "express";
import { makeDownload } from "../controllers/download.controller.js";
const router = express.Router();

router.post("/make", makeDownload);

export default router;