import express from "express";

import socialLinksController from "../controllers/social-links.controller.js";
import requireAdmin from "../middleware/require-admin.middleware.js";

const router = express.Router();

router.get("/", socialLinksController.getSocialLinks);

router.post(
  "/",
  requireAdmin,
  socialLinksController.createSocialLink
);

router.patch(
  "/:id",
  requireAdmin,
  socialLinksController.updateSocialLink
);

router.delete(
  "/:id",
  requireAdmin,
  socialLinksController.deleteSocialLink
);

export default router;