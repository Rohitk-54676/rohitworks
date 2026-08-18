const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isOptionalString = (value) => {
  return (
    value === undefined ||
    value === null ||
    typeof value === "string"
  );
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

const validateSkill = (data = {}, { partial = false } = {}) => {
  const errors = {};

  /*
   * Name
   */

  if (!partial || data.name !== undefined) {
    if (!isNonEmptyString(data.name)) {
      errors.name = "Skill name is required";
    } else if (data.name.trim().length > 100) {
      errors.name = "Skill name must not exceed 100 characters";
    }
  }

  /*
   * Category
   */

  if (!partial || data.category !== undefined) {
    if (!isNonEmptyString(data.category)) {
      errors.category = "Skill category is required";
    } else if (data.category.trim().length > 100) {
      errors.category =
        "Skill category must not exceed 100 characters";
    }
  }

  /*
   * Icon reference
   */

  if (
    data.icon_reference !== undefined &&
    !isOptionalString(data.icon_reference)
  ) {
    errors.icon_reference = "Icon reference must be a string";
  }

  if (
    typeof data.icon_reference === "string" &&
    data.icon_reference.length > 255
  ) {
    errors.icon_reference =
      "Icon reference must not exceed 255 characters";
  }

  /*
   * Display order
   */

  if (
    data.display_order !== undefined &&
    !isInteger(data.display_order)
  ) {
    errors.display_order = "Display order must be an integer";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateSkillId = (id) => {
  return isValidUuid(id);
};

export {
  validateSkill,
  validateSkillId,
};