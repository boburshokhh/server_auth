import express from "express";
import { sendEmailVerification, verifyEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/send-code", sendEmailVerification);
router.post("/verify", verifyEmail);

export default router;
