import achievementMediaService from "../services/achievement-media.service.js";
import { validateAchievementId } from "../validators/achievement.validator.js";

const uploadAchievementMedia = async (req, res, next) => {
  try {
    const { id: achievementId } = req.params;

    if (!validateAchievementId(achievementId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid achievement ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Achievement media is required",
      });
    }

    const media =
      await achievementMediaService.uploadAchievementMedia({
        achievementId,
        file: req.file,
      });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAchievementMedia = async (req, res, next) => {
  try {
    const { id: achievementId } = req.params;

    if (!validateAchievementId(achievementId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid achievement ID",
      });
    }

    const result =
      await achievementMediaService.deleteAchievementMedia(
        achievementId
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  uploadAchievementMedia,
  deleteAchievementMedia,
};