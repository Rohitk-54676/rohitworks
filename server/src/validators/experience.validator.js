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

const isValidDate = (value) => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
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

const validateExperience = (data = {}, { partial = false } = {}) => {
  const errors = {};

  /*
   * Required fields
   */

  if (!partial || data.organization !== undefined) {
    if (!isNonEmptyString(data.organization)) {
      errors.organization = "Organization is required";
    } else if (data.organization.trim().length > 200) {
      errors.organization =
        "Organization must not exceed 200 characters";
    }
  }

  if (!partial || data.role !== undefined) {
    if (!isNonEmptyString(data.role)) {
      errors.role = "Role is required";
    } else if (data.role.trim().length > 200) {
      errors.role = "Role must not exceed 200 characters";
    }
  }

  if (!partial || data.start_date !== undefined) {
    if (!data.start_date) {
      errors.start_date = "Start date is required";
    } else if (!isValidDate(data.start_date)) {
      errors.start_date =
        "Start date must be a valid YYYY-MM-DD date";
    }
  }

  /*
   * Optional strings
   */

  if (
    data.location !== undefined &&
    !isOptionalString(data.location)
  ) {
    errors.location = "Location must be a string";
  }

  if (
    typeof data.location === "string" &&
    data.location.length > 200
  ) {
    errors.location = "Location must not exceed 200 characters";
  }

  if (
    data.description !== undefined &&
    !isOptionalString(data.description)
  ) {
    errors.description = "Description must be a string";
  }

  if (
    data.achievements !== undefined &&
    !isOptionalString(data.achievements)
  ) {
    errors.achievements = "Achievements must be a string";
  }

  /*
   * End date
   */

  if (
    data.end_date !== undefined &&
    !isValidDate(data.end_date)
  ) {
    errors.end_date =
      "End date must be a valid YYYY-MM-DD date";
  }

  /*
   * Boolean
   */

  if (
    data.is_current !== undefined &&
    !isBoolean(data.is_current)
  ) {
    errors.is_current = "is_current must be a boolean";
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

  /*
   * Current experience cannot have an end date.
   */

  if (
    data.is_current === true &&
    data.end_date !== undefined &&
    data.end_date !== null
  ) {
    errors.end_date =
      "Current experience cannot have an end date";
  }

  /*
   * End date cannot be before start date.
   */

  if (
    isValidDate(data.start_date) &&
    isValidDate(data.end_date) &&
    data.start_date &&
    data.end_date &&
    data.end_date < data.start_date
  ) {
    errors.end_date =
      "End date cannot be before start date";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateExperienceId = (id) => {
  return isValidUuid(id);
};

export {
  validateExperience,
  validateExperienceId,
};