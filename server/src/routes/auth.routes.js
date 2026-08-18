import { Router } from "express";

import authController from "../controllers/auth.controller.js";
import requireAdmin from "../middleware/require-admin.middleware.js";

const router = Router();

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/me", requireAdmin, authController.getMe);

export default router;