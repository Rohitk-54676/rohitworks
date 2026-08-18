import experienceService from "../services/experience.service.js";
import {
  validateExperience,
  validateExperienceId,
} from "../validators/experience.validator.js";

const getExperience = async (req, res, next) => {
  try {
    const experience = await experienceService.getExperience();

    return res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

const createExperience = async (req, res, next) => {
  try {
    const { isValid, errors } = validateExperience(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const experience = await experienceService.createExperience(
      req.body
    );

    return res.status(201).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

const updateExperience = async (req, res, next) => {
  try {
    if (!validateExperienceId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience ID",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    const { isValid, errors } = validateExperience(req.body, {
      partial: true,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const experience = await experienceService.updateExperience(
      req.params.id,
      req.body
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExperience = async (req, res, next) => {
  try {
    if (!validateExperienceId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience ID",
      });
    }

    const deletedExperience =
      await experienceService.deleteExperience(req.params.id);

    if (!deletedExperience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedExperience,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
};