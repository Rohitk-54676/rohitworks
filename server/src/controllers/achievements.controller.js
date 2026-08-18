import achievementsService from "../services/achievements.service.js";
import {
  validateAchievement,
  validateAchievementId,
} from "../validators/achievement.validator.js";

const getAchievements = async (req, res, next) => {
  try {
    const achievements = await achievementsService.getAchievements();

    return res.status(200).json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

const createAchievement = async (req, res, next) => {
  try {
    const { isValid, errors } = validateAchievement(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const achievement = await achievementsService.createAchievement(
      req.body
    );

    return res.status(201).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

const updateAchievement = async (req, res, next) => {
  try {
    if (!validateAchievementId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid achievement ID",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    const { isValid, errors } = validateAchievement(req.body, {
      partial: true,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const achievement = await achievementsService.updateAchievement(
      req.params.id,
      req.body
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAchievement = async (req, res, next) => {
  try {
    if (!validateAchievementId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid achievement ID",
      });
    }

    const deletedAchievement =
      await achievementsService.deleteAchievement(req.params.id);

    if (!deletedAchievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedAchievement,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};