const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isValidUuid = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
};

const validateTechnology = (
  data = {},
  { partial = false } = {}
) => {
  const errors = {};

  /*
   * Name
   */

  if (!partial || data.name !== undefined) {
    if (!isNonEmptyString(data.name)) {
      errors.name = "Technology name is required";
    } else if (data.name.trim().length > 100) {
      errors.name =
        "Technology name must not exceed 100 characters";
    }
  }

  /*
   * Slug
   */

  if (!partial || data.slug !== undefined) {
    if (!isNonEmptyString(data.slug)) {
      errors.slug = "Technology slug is required";
    } else if (data.slug.trim().length > 120) {
      errors.slug =
        "Technology slug must not exceed 120 characters";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateTechnologyId = (id) => {
  return isValidUuid(id);
};

export {
  validateTechnology,
  validateTechnologyId,
};