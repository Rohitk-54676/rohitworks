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

const validateAchievement = (
  data = {},
  { partial = false } = {}
) => {
  const errors = {};

  /*
   * Title
   */

  if (!partial || data.title !== undefined) {
    if (!isNonEmptyString(data.title)) {
      errors.title = "Title is required";
    } else if (data.title.trim().length > 200) {
      errors.title = "Title must not exceed 200 characters";
    }
  }

  /*
   * Description
   */

  if (
    data.description !== undefined &&
    !isOptionalString(data.description)
  ) {
    errors.description = "Description must be a string";
  }

  /*
   * Organization
   */

  if (
    data.organization !== undefined &&
    !isOptionalString(data.organization)
  ) {
    errors.organization = "Organization must be a string";
  }

  if (
    typeof data.organization === "string" &&
    data.organization.length > 200
  ) {
    errors.organization =
      "Organization must not exceed 200 characters";
  }

  /*
   * Achievement date
   */

  if (
    data.achievement_date !== undefined &&
    !isValidDate(data.achievement_date)
  ) {
    errors.achievement_date =
      "Achievement date must be a valid YYYY-MM-DD date";
  }

  /*
   * Proof URL
   */

  if (
    data.proof_url !== undefined &&
    !isValidUrl(data.proof_url)
  ) {
    errors.proof_url = "Proof URL must be a valid URL";
  }

  /*
   * Media URL
   */

  if (
    data.media_url !== undefined &&
    !isValidUrl(data.media_url)
  ) {
    errors.media_url = "Media URL must be a valid URL";
  }

  /*
   * Media public ID
   */

  if (
    data.media_public_id !== undefined &&
    !isOptionalString(data.media_public_id)
  ) {
    errors.media_public_id = "Media public ID must be a string";
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

const validateAchievementId = (id) => {
  return isValidUuid(id);
};

export {
  validateAchievement,
  validateAchievementId,
};