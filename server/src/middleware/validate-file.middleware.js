import { isValidFileSignature } from "../utils/file-signature.js";

const validateUploadedFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File is required",
    });
  }

  const isValid = isValidFileSignature(
    req.file.buffer,
    req.file.mimetype
  );

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "File content does not match the declared file type",
    });
  }

  next();
};

export default validateUploadedFile;