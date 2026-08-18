import multer from "multer";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const allowedPdfMimeTypes = new Set([
  "application/pdf",
]);

const storage = multer.memoryStorage();

const createImageUpload = () => {
  return multer({
    storage,
    limits: {
      fileSize: MAX_IMAGE_SIZE,
      files: 1,
    },
    fileFilter: (req, file, callback) => {
      if (!allowedImageMimeTypes.has(file.mimetype)) {
        return callback(
          new multer.MulterError(
            "LIMIT_UNEXPECTED_FILE",
            "file"
          )
        );
      }

      callback(null, true);
    },
  });
};

const createPdfUpload = () => {
  return multer({
    storage,
    limits: {
      fileSize: MAX_PDF_SIZE,
      files: 1,
    },
    fileFilter: (req, file, callback) => {
      if (!allowedPdfMimeTypes.has(file.mimetype)) {
        return callback(
          new multer.MulterError(
            "LIMIT_UNEXPECTED_FILE",
            "file"
          )
        );
      }

      callback(null, true);
    },
  });
};

const imageUpload = createImageUpload();
const pdfUpload = createPdfUpload();

export {
  imageUpload,
  pdfUpload,
  createImageUpload,
  createPdfUpload,
  MAX_IMAGE_SIZE,
  MAX_PDF_SIZE,
};