import express from "express";
import { getUserByID, loginUser, registerUser } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/:id", getUserByID);

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
