import profileImageService from "../services/profile-image.service.js";

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const profileImage =
      await profileImageService.uploadProfileImage(req.file);

    if (!profileImage) {
      return res.status(404).json({
        success: false,
        message: "Site settings not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profileImage,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProfileImage = async (req, res, next) => {
  try {
    const result =
      await profileImageService.deleteProfileImage();

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
  uploadProfileImage,
  deleteProfileImage,
};