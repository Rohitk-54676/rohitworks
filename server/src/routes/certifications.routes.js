import express from "express";

import certificationsController from "../controllers/certifications.controller.js";
import certificationMediaController from "../controllers/certification-media.controller.js";

import requireAdmin from "../middleware/require-admin.middleware.js";
import { imageUpload } from "../middleware/upload.middleware.js";
import validateUploadedFile from "../middleware/validate-file.middleware.js";

const router = express.Router();

/*
 * Public route
 */

router.get(
  "/",
  certificationsController.getCertifications
);

/*
 * Protected admin routes
 */

router.post(
  "/",
  requireAdmin,
  certificationsController.createCertification
);

router.patch(
  "/:id",
  requireAdmin,
  certificationsController.updateCertification
);

router.delete(
  "/:id",
  requireAdmin,
  certificationsController.deleteCertification
);

/*
 * Certificate media
 */

router.post(
  "/:id/media",
  requireAdmin,
  imageUpload.single("file"),
  validateUploadedFile,
  certificationMediaController.uploadCertificationMedia
);

router.delete(
  "/:id/media",
  requireAdmin,
  certificationMediaController.deleteCertificationMedia
);

export default router;