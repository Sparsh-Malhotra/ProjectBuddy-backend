import express from "express";
import {
  clearUnreadMessages,
  createChat,
  getAllChats,
} from "../controllers/chat.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create-chat", verifyToken, createChat);

router.get("get-chats", verifyToken, getAllChats);

router.get("/clear-unread-messages", verifyToken, clearUnreadMessages);

export default router;
