import technologiesService from "../services/technologies.service.js";
import {
  validateTechnology,
  validateTechnologyId,
} from "../validators/technology.validator.js";

const getTechnologies = async (req, res, next) => {
  try {
    const technologies =
      await technologiesService.getTechnologies();

    return res.status(200).json({
      success: true,
      data: technologies,
    });
  } catch (error) {
    next(error);
  }
};


const createTechnology = async (req, res, next) => {
  try {
    const { isValid, errors } = validateTechnology(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const technology =
      await technologiesService.createTechnology(req.body);

    return res.status(201).json({
      success: true,
      data: technology,
    });
  } catch (error) {
    next(error);
  }
};


const updateTechnology = async (req, res, next) => {
  try {
    if (!validateTechnologyId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technology ID",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    const { isValid, errors } = validateTechnology(
      req.body,
      {
        partial: true,
      }
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const technology =
      await technologiesService.updateTechnology(
        req.params.id,
        req.body
      );

    if (!technology) {
      return res.status(404).json({
        success: false,
        message: "Technology not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: technology,
    });
  } catch (error) {
    next(error);
  }
};


const deleteTechnology = async (req, res, next) => {
  try {
    if (!validateTechnologyId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technology ID",
      });
    }

    const deletedTechnology =
      await technologiesService.deleteTechnology(
        req.params.id
      );

    if (!deletedTechnology) {
      return res.status(404).json({
        success: false,
        message: "Technology not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedTechnology,
    });
  } catch (error) {
    next(error);
  }
};


export default {
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
};