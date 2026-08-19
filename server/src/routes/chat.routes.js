import express from "express";

import chatController from "../controllers/chat.controller.js";
import { validateChatMessage } from "../validators/chat.validator.js";
import chatRateLimit from "../middleware/chat-rate-limit.middleware.js";

const router = express.Router();

router.post(
  "/",
  chatRateLimit,
  validateChatMessage,
  chatController.chat
);

router.post(
  "/project/:projectSlug",
  chatRateLimit,
  validateChatMessage,
  chatController.chatAboutProject
);

export default router;