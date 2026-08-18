import express from "express";

import siteSettingsController from "../controllers/site-settings.controller.js";
import profileImageController from "../controllers/profile-image.controller.js";
import resumeController from "../controllers/resume.controller.js";

import requireAdmin from "../middleware/require-admin.middleware.js";
import {
  imageUpload,
  pdfUpload,
} from "../middleware/upload.middleware.js";
import validateUploadedFile from "../middleware/validate-file.middleware.js";

const router = express.Router();

/*
 * Public routes
 */

router.get("/", siteSettingsController.getSiteSettings);

/*
 * Protected admin routes
 */

router.patch(
  "/",
  requireAdmin,
  siteSettingsController.updateSiteSettings
);

/*
 * Profile image
 */

router.post(
  "/profile-image",
  requireAdmin,
  imageUpload.single("file"),
  validateUploadedFile,
  profileImageController.uploadProfileImage
);

router.delete(
  "/profile-image",
  requireAdmin,
  profileImageController.deleteProfileImage
);

/*
 * Resume
 */

router.post(
  "/resume",
  requireAdmin,
  pdfUpload.single("file"),
  validateUploadedFile,
  resumeController.uploadResume
);

router.delete(
  "/resume",
  requireAdmin,
  resumeController.deleteResume
);

export default router;