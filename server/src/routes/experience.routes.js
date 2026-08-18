import express from "express";

import experienceController from "../controllers/experience.controller.js";
import requireAdmin from "../middleware/require-admin.middleware.js";

const router = express.Router();

/*
 * Public route
 */

router.get("/", experienceController.getExperience);

/*
 * Protected admin routes
 */

router.post(
  "/",
  requireAdmin,
  experienceController.createExperience
);

router.patch(
  "/:id",
  requireAdmin,
  experienceController.updateExperience
);

router.delete(
  "/:id",
  requireAdmin,
  experienceController.deleteExperience
);

export default router;