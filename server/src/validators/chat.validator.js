const MAX_MESSAGE_LENGTH = 1500;

const validateChatMessage = (req, res, next) => {
  const { message } = req.body || {};

  if (typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "Message must be a string.",
    });
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return res.status(400).json({
      success: false,
      message: "Message cannot be empty.",
    });
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      success: false,
      message: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  req.body.message = trimmedMessage;

  return next();
};

export {
  MAX_MESSAGE_LENGTH,
  validateChatMessage,
};