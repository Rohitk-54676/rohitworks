import projectImagesService from "../services/project-images.service.js";
import validateProjectImage from "../validators/project-image.validator.js";
import { validateProjectId } from "../validators/project.validator.js";

const uploadProjectImage = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;

    if (!validateProjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const { isValid, errors } = validateProjectImage(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const image = await projectImagesService.createProjectImage({
      projectId,
      file: req.file,
      altText: req.body.alt_text?.trim() || null,
      displayOrder:
        req.body.display_order !== undefined
          ? Number(req.body.display_order)
          : 0,
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
};



const deleteProjectImage = async (req, res, next) => {
  try {
    const { id: projectId, imageId } = req.params;

    if (!validateProjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    if (!validateProjectId(imageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image ID",
      });
    }

    const deletedImage =
      await projectImagesService.deleteProjectImage({
        projectId,
        imageId,
      });

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Project image not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedImage,
    });
  } catch (error) {
    next(error);
  }
};


const replaceProjectImage = async (req, res, next) => {
  try {
    const { id: projectId, imageId } = req.params;

    if (!validateProjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    if (!validateProjectId(imageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Replacement image file is required",
      });
    }

    const { isValid, errors } =
      validateProjectImage(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const updatedImage =
      await projectImagesService.replaceProjectImage({
        projectId,
        imageId,
        file: req.file,
        altText:
          req.body.alt_text !== undefined
            ? req.body.alt_text.trim() || null
            : undefined,
        displayOrder:
          req.body.display_order !== undefined
            ? Number(req.body.display_order)
            : undefined,
      });

    if (!updatedImage) {
      return res.status(404).json({
        success: false,
        message: "Project image not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedImage,
    });
  } catch (error) {
    next(error);
  }
};



export default {
  uploadProjectImage,
  deleteProjectImage,
  replaceProjectImage,
};