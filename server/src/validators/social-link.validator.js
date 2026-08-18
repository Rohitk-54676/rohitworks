const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isValidUrl = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isBoolean = (value) => {
  return typeof value === "boolean";
};

const isInteger = (value) => {
  return Number.isInteger(value);
};

const isValidUuid = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
};

const validateSocialLink = (
  data = {},
  { partial = false } = {}
) => {
  const errors = {};

  if (!partial || data.platform !== undefined) {
    if (!isNonEmptyString(data.platform)) {
      errors.platform = "Platform is required";
    } else if (data.platform.trim().length > 100) {
      errors.platform =
        "Platform must not exceed 100 characters";
    }
  }

  if (!partial || data.url !== undefined) {
    if (!isValidUrl(data.url)) {
      errors.url = "URL must be a valid URL";
    }
  }

  if (
    data.display_order !== undefined &&
    !isInteger(data.display_order)
  ) {
    errors.display_order = "Display order must be an integer";
  }

  if (
    data.is_active !== undefined &&
    !isBoolean(data.is_active)
  ) {
    errors.is_active = "is_active must be a boolean";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateSocialLinkId = (id) => {
  return isValidUuid(id);
};

export {
  validateSocialLink,
  validateSocialLinkId,
};