import educationService from "../services/education.service.js";
import {
  validateEducation,
  validateEducationId,
} from "../validators/education.validator.js";

const getEducation = async (req, res, next) => {
  try {
    const education = await educationService.getEducation();

    return res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

const createEducation = async (req, res, next) => {
  try {
    const { isValid, errors } = validateEducation(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const education = await educationService.createEducation(req.body);

    return res.status(201).json({
      success: true,
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

const updateEducation = async (req, res, next) => {
  try {
    if (!validateEducationId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid education ID",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    const { isValid, errors } = validateEducation(req.body, {
      partial: true,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const education = await educationService.updateEducation(
      req.params.id,
      req.body
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEducation = async (req, res, next) => {
  try {
    if (!validateEducationId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid education ID",
      });
    }

    const deletedEducation =
      await educationService.deleteEducation(req.params.id);

    if (!deletedEducation) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedEducation,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};