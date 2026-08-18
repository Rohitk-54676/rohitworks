import express from "express";

import skillsController from "../controllers/skills.controller.js";
import requireAdmin from "../middleware/require-admin.middleware.js";

const router = express.Router();

/*
 * Public route
 */

router.get("/", skillsController.getSkills);

/*
 * Protected admin routes
 */

router.post(
  "/",
  requireAdmin,
  skillsController.createSkill
);

router.patch(
  "/:id",
  requireAdmin,
  skillsController.updateSkill
);

router.delete(
  "/:id",
  requireAdmin,
  skillsController.deleteSkill
);

export default router;