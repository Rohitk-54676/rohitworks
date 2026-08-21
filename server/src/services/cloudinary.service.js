import { v2 as cloudinary } from "cloudinary";

import env from "../config/env.js";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const uploadBuffer = (buffer, options = {}) => {
  if (!Buffer.isBuffer(buffer)) {
    return Promise.reject(
      new Error("Cloudinary upload requires a valid buffer")
    );
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: options.resourceType || "auto",
      folder: options.folder,
      public_id: options.publicId,
      overwrite: options.overwrite ?? false,

      use_filename: options.useFilename ?? false,
      unique_filename: options.uniqueFilename ?? true,
    };

    if (!uploadOptions.folder) {
      delete uploadOptions.folder;
    }

    if (!uploadOptions.public_id) {
      delete uploadOptions.public_id;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(
            new Error("Cloudinary upload returned no result")
          );
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

const deleteAsset = async (
  publicId,
  { resourceType = "image" } = {}
) => {
  if (!publicId) {
    throw new Error("Cloudinary public ID is required");
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
};

export default {
  uploadBuffer,
  deleteAsset,
};