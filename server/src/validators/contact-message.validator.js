const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isValidEmail = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const isBoolean = (value) => {
  return typeof value === "boolean";
};

const isValidUuid = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
};

const validateContactMessage = (data = {}) => {
  const errors = {};

  if (!isNonEmptyString(data.name)) {
    errors.name = "Name is required";
  } else if (data.name.trim().length > 200) {
    errors.name = "Name must not exceed 200 characters";
  }

  if (!isValidEmail(data.email)) {
    errors.email = "A valid email is required";
  } else if (data.email.length > 320) {
    errors.email = "Email must not exceed 320 characters";
  }

  if (
    data.subject !== undefined &&
    data.subject !== null
  ) {
    if (typeof data.subject !== "string") {
      errors.subject = "Subject must be a string";
    } else if (data.subject.length > 300) {
      errors.subject =
        "Subject must not exceed 300 characters";
    }
  }

  if (!isNonEmptyString(data.message)) {
    errors.message = "Message is required";
  } else if (data.message.trim().length > 5000) {
    errors.message =
      "Message must not exceed 5000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateContactMessageId = (id) => {
  return isValidUuid(id);
};

const validateContactMessageReadStatus = (data = {}) => {
  const errors = {};

  if (!isBoolean(data.is_read)) {
    errors.is_read = "is_read must be a boolean";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export {
  validateContactMessage,
  validateContactMessageId,
  validateContactMessageReadStatus,
};