import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import env from "./config/env.js";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import experienceRoutes from "./routes/experience.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import achievementsRoutes from "./routes/achievements.routes.js";
import educationRoutes from "./routes/education.routes.js";
import certificationsRoutes from "./routes/certifications.routes.js";
import socialLinksRoutes from "./routes/social-links.routes.js";
import siteSettingsRoutes from "./routes/site-settings.routes.js";
import contactMessagesRoutes from "./routes/contact-messages.routes.js";

import notFoundMiddleware from "./middleware/not-found.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

/*
 * Core routes
 */

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

/*
 * Content APIs
 */

app.use("/api/projects", projectsRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/certifications", certificationsRoutes);
app.use("/api/social-links", socialLinksRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/contact", contactMessagesRoutes);

/*
 * Error handling
 */

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;