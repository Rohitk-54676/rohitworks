import express from "express";

import educationController from "../controllers/education.controller.js";
import requireAdmin from "../middleware/require-admin.middleware.js";

const router = express.Router();

router.get("/", educationController.getEducation);

router.post(
  "/",
  requireAdmin,
  educationController.createEducation
);

router.patch(
  "/:id",
  requireAdmin,
  educationController.updateEducation
);

router.delete(
  "/:id",
  requireAdmin,
  educationController.deleteEducation
);

export default router;