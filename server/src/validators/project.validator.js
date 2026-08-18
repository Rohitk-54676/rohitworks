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

const isValidUrl = (value) => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

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

const isValidDate = (value) => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  // Database columns are DATE, so require YYYY-MM-DD.
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

const validateProject = (data = {}, { partial = false } = {}) => {
  const errors = {};

  /*
   * Required fields
   */

  if (!partial || data.title !== undefined) {
    if (!isNonEmptyString(data.title)) {
      errors.title = "Title is required";
    } else if (data.title.trim().length > 200) {
      errors.title = "Title must not exceed 200 characters";
    }
  }

  if (!partial || data.slug !== undefined) {
    if (!isNonEmptyString(data.slug)) {
      errors.slug = "Slug is required";
    } else if (data.slug.length > 220) {
      errors.slug = "Slug must not exceed 220 characters";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      errors.slug =
        "Slug must contain only lowercase letters, numbers, and hyphens";
    }
  }

  if (!partial || data.short_description !== undefined) {
    if (!isNonEmptyString(data.short_description)) {
      errors.short_description = "Short description is required";
    }
  }

  /*
   * Optional string fields
   */

  const optionalStringFields = [
    "full_description",
    "thumbnail_url",
    "thumbnail_public_id",
    "github_url",
    "live_url",
    "problem",
    "solution",
    "features",
    "architecture",
    "challenges",
    "results",
    "lessons_learned",
  ];

  for (const field of optionalStringFields) {
    if (data[field] !== undefined && !isOptionalString(data[field])) {
      errors[field] = `${field} must be a string`;
    }
  }

  /*
   * String length limits
   */

  const stringLengthLimits = {
    full_description: 50000,
    thumbnail_public_id: 500,
    problem: 50000,
    solution: 50000,
    features: 50000,
    architecture: 50000,
    challenges: 50000,
    results: 50000,
    lessons_learned: 50000,
  };

  for (const [field, maxLength] of Object.entries(stringLengthLimits)) {
    if (
      typeof data[field] === "string" &&
      data[field].length > maxLength
    ) {
      errors[field] = `${field} must not exceed ${maxLength} characters`;
    }
  }

  /*
   * URLs
   */

  if (
    data.thumbnail_url !== undefined &&
    !isValidUrl(data.thumbnail_url)
  ) {
    errors.thumbnail_url = "Thumbnail URL must be a valid URL";
  }

  if (
    data.github_url !== undefined &&
    !isValidUrl(data.github_url)
  ) {
    errors.github_url = "GitHub URL must be a valid URL";
  }

  if (
    data.live_url !== undefined &&
    !isValidUrl(data.live_url)
  ) {
    errors.live_url = "Live URL must be a valid URL";
  }

  /*
   * Boolean
   */

  if (
    data.featured !== undefined &&
    !isBoolean(data.featured)
  ) {
    errors.featured = "Featured must be a boolean";
  }

  /*
   * Status
   */

  if (data.status !== undefined) {
    if (
      !isNonEmptyString(data.status) ||
      data.status.length > 50
    ) {
      errors.status =
        "Status must be a valid string of 1–50 characters";
    }
  }

  /*
   * Dates
   */

  if (
    data.start_date !== undefined &&
    !isValidDate(data.start_date)
  ) {
    errors.start_date = "Start date must be a valid YYYY-MM-DD date";
  }

  if (
    data.end_date !== undefined &&
    !isValidDate(data.end_date)
  ) {
    errors.end_date = "End date must be a valid YYYY-MM-DD date";
  }

  /*
   * Date relationship
   */

  if (
    isValidDate(data.start_date) &&
    isValidDate(data.end_date) &&
    data.start_date &&
    data.end_date &&
    data.end_date < data.start_date
  ) {
    errors.end_date = "End date cannot be before start date";
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
   * Technology IDs
   */

  if (
    data.technology_ids !== undefined &&
    !Array.isArray(data.technology_ids)
  ) {
    errors.technology_ids = "Technology IDs must be an array";
  }

  if (Array.isArray(data.technology_ids)) {
    const invalidTechnologyId = data.technology_ids.find(
      (technologyId) => !isValidUuid(technologyId)
    );

    if (invalidTechnologyId) {
      errors.technology_ids =
        "Technology IDs must contain valid UUIDs";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateProjectId = (id) => {
  return isValidUuid(id);
};

export {
  validateProject,
  validateProjectId,
};