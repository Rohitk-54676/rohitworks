import express from "express";

import achievementsController from "../controllers/achievements.controller.js";
import achievementMediaController from "../controllers/achievement-media.controller.js";

import requireAdmin from "../middleware/require-admin.middleware.js";
import { imageUpload } from "../middleware/upload.middleware.js";
import validateUploadedFile from "../middleware/validate-file.middleware.js";

const router = express.Router();

/*
 * Public route
 */

router.get(
  "/",
  achievementsController.getAchievements
);

/*
 * Protected admin routes
 */

router.post(
  "/",
  requireAdmin,
  achievementsController.createAchievement
);

router.patch(
  "/:id",
  requireAdmin,
  achievementsController.updateAchievement
);

router.delete(
  "/:id",
  requireAdmin,
  achievementsController.deleteAchievement
);

/*
 * Achievement media
 */

router.post(
  "/:id/media",
  requireAdmin,
  imageUpload.single("file"),
  validateUploadedFile,
  achievementMediaController.uploadAchievementMedia
);

router.delete(
  "/:id/media",
  requireAdmin,
  achievementMediaController.deleteAchievementMedia
);

export default router;