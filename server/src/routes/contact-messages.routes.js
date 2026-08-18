import express from "express";

import contactMessagesController from "../controllers/contact-messages.controller.js";
import requireAdmin from "../middleware/require-admin.middleware.js";

const router = express.Router();

/*
 * Public contact form
 */

router.post(
  "/",
  contactMessagesController.createContactMessage
);

/*
 * Protected admin message management
 */

router.get(
  "/",
  requireAdmin,
  contactMessagesController.getContactMessages
);

router.patch(
  "/:id",
  requireAdmin,
  contactMessagesController.markContactMessageRead
);

router.delete(
  "/:id",
  requireAdmin,
  contactMessagesController.deleteContactMessage
);

export default router;