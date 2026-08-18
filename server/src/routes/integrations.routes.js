import express from "express";

import integrationsController from "../controllers/integrations.controller.js";

const router = express.Router();

router.get(
  "/",
  integrationsController.getIntegrations
);


router.get(
  "/github/profile",
  integrationsController.getGithubProfile
);

router.get(
  "/github/repositories",
  integrationsController.getGithubRepositories
);

router.get(
  "/github/contributions",
  integrationsController.getGithubContributions
);

router.get(
  "/leetcode/profile",
  integrationsController.getLeetCodeProfile
);

router.get(
  "/leetcode/problems",
  integrationsController.getLeetCodeProblemStats
);

router.get(
  "/leetcode/activity",
  integrationsController.getLeetCodeActivity
);

router.get(
  "/leetcode/languages",
  integrationsController.getLeetCodeLanguages
);


export default router;