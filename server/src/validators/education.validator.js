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

const validateEducation = (
  data = {},
  { partial = false } = {}
) => {
  const errors = {};

  if (!partial || data.institution !== undefined) {
    if (!isNonEmptyString(data.institution)) {
      errors.institution = "Institution is required";
    } else if (data.institution.trim().length > 200) {
      errors.institution =
        "Institution must not exceed 200 characters";
    }
  }

  if (!partial || data.degree !== undefined) {
    if (!isNonEmptyString(data.degree)) {
      errors.degree = "Degree is required";
    } else if (data.degree.trim().length > 200) {
      errors.degree = "Degree must not exceed 200 characters";
    }
  }

  if (
    data.field !== undefined &&
    !isOptionalString(data.field)
  ) {
    errors.field = "Field must be a string";
  }

  if (
    typeof data.field === "string" &&
    data.field.length > 200
  ) {
    errors.field = "Field must not exceed 200 characters";
  }

  if (
    data.description !== undefined &&
    !isOptionalString(data.description)
  ) {
    errors.description = "Description must be a string";
  }

  if (
    data.start_date !== undefined &&
    !isValidDate(data.start_date)
  ) {
    errors.start_date =
      "Start date must be a valid YYYY-MM-DD date";
  }

  if (
    data.end_date !== undefined &&
    !isValidDate(data.end_date)
  ) {
    errors.end_date =
      "End date must be a valid YYYY-MM-DD date";
  }

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

const validateEducationId = (id) => {
  return isValidUuid(id);
};

export {
  validateEducation,
  validateEducationId,
};