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

const validateCertification = (
  data = {},
  { partial = false } = {}
) => {
  const errors = {};

  if (!partial || data.title !== undefined) {
    if (!isNonEmptyString(data.title)) {
      errors.title = "Title is required";
    } else if (data.title.trim().length > 200) {
      errors.title = "Title must not exceed 200 characters";
    }
  }

  if (!partial || data.issuing_organization !== undefined) {
    if (!isNonEmptyString(data.issuing_organization)) {
      errors.issuing_organization =
        "Issuing organization is required";
    } else if (data.issuing_organization.trim().length > 200) {
      errors.issuing_organization =
        "Issuing organization must not exceed 200 characters";
    }
  }

  if (
    data.issue_date !== undefined &&
    !isValidDate(data.issue_date)
  ) {
    errors.issue_date =
      "Issue date must be a valid YYYY-MM-DD date";
  }

  const stringFields = [
    "credential_id",
    "certificate_image_public_id",
  ];

  for (const field of stringFields) {
    if (
      data[field] !== undefined &&
      !isOptionalString(data[field])
    ) {
      errors[field] = `${field} must be a string`;
    }
  }

  if (
    data.credential_id !== undefined &&
    typeof data.credential_id === "string" &&
    data.credential_id.length > 200
  ) {
    errors.credential_id =
      "Credential ID must not exceed 200 characters";
  }

  if (
    data.credential_url !== undefined &&
    !isValidUrl(data.credential_url)
  ) {
    errors.credential_url =
      "Credential URL must be a valid URL";
  }

  if (
    data.certificate_image_url !== undefined &&
    !isValidUrl(data.certificate_image_url)
  ) {
    errors.certificate_image_url =
      "Certificate image URL must be a valid URL";
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

const validateCertificationId = (id) => {
  return isValidUuid(id);
};

export {
  validateCertification,
  validateCertificationId,
};