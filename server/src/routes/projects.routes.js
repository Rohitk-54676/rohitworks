import express from "express";

import projectsController from "../controllers/projects.controller.js";
import projectImagesController from "../controllers/project-images.controller.js";
import projectThumbnailController from "../controllers/project-thumbnail.controller.js";

import requireAdmin from "../middleware/require-admin.middleware.js";
import { imageUpload } from "../middleware/upload.middleware.js";
import validateUploadedFile from "../middleware/validate-file.middleware.js";

const router = express.Router();

/*
 * Public routes
 */

router.get("/", projectsController.getProjects);

/*
 * Protected admin routes
 */

router.post(
  "/:id/images",
  requireAdmin,
  imageUpload.single("file"),
  validateUploadedFile,
  projectImagesController.uploadProjectImage
);

router.put(
  "/:id/images/:imageId",
  requireAdmin,
  imageUpload.single("file"),
  validateUploadedFile,
  projectImagesController.replaceProjectImage
);

router.delete(
  "/:id/images/:imageId",
  requireAdmin,
  projectImagesController.deleteProjectImage
);

router.post(
  "/:id/thumbnail",
  requireAdmin,
  imageUpload.single("file"),
  validateUploadedFile,
  projectThumbnailController.uploadProjectThumbnail
);

router.delete(
  "/:id/thumbnail",
  requireAdmin,
  projectThumbnailController.deleteProjectThumbnail
);

router.post(
  "/",
  requireAdmin,
  projectsController.createProject
);

router.patch(
  "/:id",
  requireAdmin,
  projectsController.updateProject
);

router.delete(
  "/:id",
  requireAdmin,
  projectsController.deleteProject
);

/*
 * Public project detail
 */

router.get("/:slug", projectsController.getProjectBySlug);

export default router;