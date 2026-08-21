const isOptionalString = (value) => {
  return (
    value === undefined ||
    value === null ||
    typeof value === "string"
  );
};

const isValidUrl = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
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

const isValidEmail = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
};

const validateSiteSettings = (data = {}) => {
  const errors = {};

  const stringFields = [
    "name",
    "headline",
    "bio",
    "email",
    "location",
    "availability_status",
    "profile_image_url",
    "profile_image_public_id",
    "resume_url",
    "resume_public_id",
    "current_focus",
  ];

  for (const field of stringFields) {
    if (
      data[field] !== undefined &&
      !isOptionalString(data[field])
    ) {
      errors[field] =
        `${field} must be a string`;
    }
  }

  if (
    data.name !== undefined &&
    typeof data.name === "string" &&
    data.name.trim().length === 0
  ) {
    errors.name = "Name cannot be empty";
  }

  if (
    typeof data.name === "string" &&
    data.name.length > 200
  ) {
    errors.name =
      "Name must not exceed 200 characters";
  }

  if (
    typeof data.headline === "string" &&
    data.headline.length > 300
  ) {
    errors.headline =
      "Headline must not exceed 300 characters";
  }

  if (
    typeof data.location === "string" &&
    data.location.length > 200
  ) {
    errors.location =
      "Location must not exceed 200 characters";
  }

  if (
    typeof data.availability_status === "string" &&
    data.availability_status.length > 100
  ) {
    errors.availability_status =
      "Availability status must not exceed 100 characters";
  }

  if (!isValidEmail(data.email)) {
    errors.email =
      "Email must be a valid email address";
  }

  if (!isValidUrl(data.profile_image_url)) {
    errors.profile_image_url =
      "Profile image URL must be a valid URL";
  }

  if (!isValidUrl(data.resume_url)) {
    errors.resume_url =
      "Resume URL must be a valid URL";
  }

  return {
    isValid:
      Object.keys(errors).length === 0,
    errors,
  };
};

export {
  validateSiteSettings,
};