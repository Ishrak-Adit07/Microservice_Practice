import express from "express";
import { getUserByID, loginUser, registerUser, testAuth, validateUserByID } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/:id", getUserByID);
router.get("/validate/:id", validateUserByID);

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/test", testAuth);

export default router;
