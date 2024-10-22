import express from "express";
import { makeDownload, testDownload } from "../controllers/download.controller.js";
import auth from "../middlewares/auth.mw.js";
const router = express.Router();

router.post("/make", auth, makeDownload);
router.get("/test", testDownload);
export default router;