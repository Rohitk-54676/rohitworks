import express from "express";

import technologiesController from "../controllers/technologies.controller.js";
import requireAdmin from "../middleware/require-admin.middleware.js";

const router = express.Router();

/*
 * Public route
 */

router.get(
  "/",
  technologiesController.getTechnologies
);

/*
 * Protected admin routes
 */

router.post(
  "/",
  requireAdmin,
  technologiesController.createTechnology
);

router.patch(
  "/:id",
  requireAdmin,
  technologiesController.updateTechnology
);

router.delete(
  "/:id",
  requireAdmin,
  technologiesController.deleteTechnology
);

export default router;