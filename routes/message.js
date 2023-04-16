import express from "express";
import verifyToken from "../utils/verifyToken.js";
import { sendMessage, getAllMessages } from "../controllers/message.js";

const router = express.Router();

router.post("/send-message", verifyToken, sendMessage);

router.get("get-messages/:chatId", verifyToken, getAllMessages);

export default router;
