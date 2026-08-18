const isJpeg = (buffer) => {
  return (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  );
};

const isPng = (buffer) => {
  return (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
};

const isWebp = (buffer) => {
  return (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
};

const isPdf = (buffer) => {
  return (
    buffer.length >= 5 &&
    buffer.toString("ascii", 0, 5) === "%PDF-"
  );
};

const isValidFileSignature = (buffer, mimeType) => {
  if (!Buffer.isBuffer(buffer)) {
    return false;
  }

  switch (mimeType) {
    case "image/jpeg":
      return isJpeg(buffer);

    case "image/png":
      return isPng(buffer);

    case "image/webp":
      return isWebp(buffer);

    case "application/pdf":
      return isPdf(buffer);

    default:
      return false;
  }
};

export {
  isValidFileSignature,
};