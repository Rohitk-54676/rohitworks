import resumeService from "../services/resume.service.js";

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const resume =
      await resumeService.uploadResume(req.file);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Site settings not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

const deleteResume = async (req, res, next) => {
  try {
    const result =
      await resumeService.deleteResume();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Site settings not found",
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
  uploadResume,
  deleteResume,
};