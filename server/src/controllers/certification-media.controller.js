import certificationMediaService from "../services/certification-media.service.js";
import { validateCertificationId } from "../validators/certification.validator.js";

const uploadCertificationMedia = async (req, res, next) => {
  try {
    const { id: certificationId } = req.params;

    if (!validateCertificationId(certificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certification ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Certificate image is required",
      });
    }

    const media =
      await certificationMediaService.uploadCertificationMedia({
        certificationId,
        file: req.file,
      });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
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

const deleteCertificationMedia = async (req, res, next) => {
  try {
    const { id: certificationId } = req.params;

    if (!validateCertificationId(certificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certification ID",
      });
    }

    const result =
      await certificationMediaService.deleteCertificationMedia(
        certificationId
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
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
  uploadCertificationMedia,
  deleteCertificationMedia,
};