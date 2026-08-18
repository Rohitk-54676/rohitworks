const validateProjectImage = (data = {}) => {
  const errors = {};

  if (
    data.alt_text !== undefined &&
    data.alt_text !== null
  ) {
    if (typeof data.alt_text !== "string") {
      errors.alt_text = "Alt text must be a string";
    } else if (data.alt_text.trim().length > 255) {
      errors.alt_text = "Alt text must not exceed 255 characters";
    }
  }

  if (data.display_order !== undefined) {
    const value = Number(data.display_order);

    if (
      !Number.isInteger(value) ||
      value < 0
    ) {
      errors.display_order =
        "Display order must be a non-negative integer";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateProjectImage;