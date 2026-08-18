import projectThumbnailService from "../services/project-thumbnail.service.js";
import { validateProjectId } from "../validators/project.validator.js";

const uploadProjectThumbnail = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;

    if (!validateProjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    const thumbnail =
      await projectThumbnailService.uploadProjectThumbnail({
        projectId,
        file: req.file,
      });

    if (!thumbnail) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: thumbnail,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProjectThumbnail = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;

    if (!validateProjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const result =
      await projectThumbnailService.deleteProjectThumbnail(
        projectId
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
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
  uploadProjectThumbnail,
  deleteProjectThumbnail,
};