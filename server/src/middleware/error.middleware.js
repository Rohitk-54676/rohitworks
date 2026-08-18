import multer from "multer";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  /*
   * Invalid JSON body
   */
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  /*
   * Multer upload errors
   */
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "Uploaded file exceeds the allowed size limit",
        });

      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Invalid or unexpected file type",
        });

      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Only one file can be uploaded at a time",
        });

      case "LIMIT_FIELD_COUNT":
        return res.status(400).json({
          success: false,
          message: "Too many form fields",
        });

      default:
        return res.status(400).json({
          success: false,
          message: "File upload failed",
        });
    }
  }

  /*
   * PostgreSQL unique constraint violation
   */
  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      message:
        "A resource with the provided unique value already exists",
    });
  }

  /*
   * Default application error
   */
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

export default errorMiddleware;