import contactMessagesService from "../services/contact-messages.service.js";
import {
  validateContactMessage,
  validateContactMessageId,
  validateContactMessageReadStatus,
} from "../validators/contact-message.validator.js";

const getContactMessages = async (req, res, next) => {
  try {
    const unreadOnly = req.query.unreadOnly === "true";

    const messages =
      await contactMessagesService.getContactMessages({
        unreadOnly,
      });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

const createContactMessage = async (req, res, next) => {
  try {
    const { isValid, errors } =
      validateContactMessage(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const result =
      await contactMessagesService.createContactMessage(
        req.body
      );

    return res.status(201).json({
      success: true,
      data: result.contactMessage,
    });
  } catch (error) {
    next(error);
  }
};

const markContactMessageRead = async (req, res, next) => {
  try {
    if (!validateContactMessageId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID",
      });
    }

    const { isValid, errors } =
      validateContactMessageReadStatus(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const message =
      await contactMessagesService.markContactMessageRead(
        req.params.id,
        req.body.is_read
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContactMessage = async (req, res, next) => {
  try {
    if (!validateContactMessageId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID",
      });
    }

    const deletedMessage =
      await contactMessagesService.deleteContactMessage(
        req.params.id
      );

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedMessage,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getContactMessages,
  createContactMessage,
  markContactMessageRead,
  deleteContactMessage,
};