import certificationsService from "../services/certifications.service.js";
import {
  validateCertification,
  validateCertificationId,
} from "../validators/certification.validator.js";

const getCertifications = async (req, res, next) => {
  try {
    const certifications =
      await certificationsService.getCertifications();

    return res.status(200).json({
      success: true,
      data: certifications,
    });
  } catch (error) {
    next(error);
  }
};

const createCertification = async (req, res, next) => {
  try {
    const { isValid, errors } = validateCertification(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const certification =
      await certificationsService.createCertification(req.body);

    return res.status(201).json({
      success: true,
      data: certification,
    });
  } catch (error) {
    next(error);
  }
};

const updateCertification = async (req, res, next) => {
  try {
    if (!validateCertificationId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certification ID",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    const { isValid, errors } = validateCertification(req.body, {
      partial: true,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const certification =
      await certificationsService.updateCertification(
        req.params.id,
        req.body
      );

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: certification,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCertification = async (req, res, next) => {
  try {
    if (!validateCertificationId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certification ID",
      });
    }

    const deletedCertification =
      await certificationsService.deleteCertification(
        req.params.id
      );

    if (!deletedCertification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedCertification,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
};