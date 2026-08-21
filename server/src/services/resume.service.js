import pool from "../db/pool.js";
import { v2 as cloudinary } from "cloudinary";

import env from "../config/env.js";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const uploadResume = async (file) => {
  const settingsResult = await pool.query(`
    SELECT
      id,
      resume_public_id
    FROM site_settings
    WHERE id = 1;
  `);

  if (settingsResult.rows.length === 0) {
    return null;
  }

  const settings = settingsResult.rows[0];

  let newCloudinaryAsset;

  try {
    const base64File = file.buffer.toString("base64");

    const dataUri =
      `data:application/pdf;base64,${base64File}`;

    newCloudinaryAsset =
      await cloudinary.uploader.upload(dataUri, {
        resource_type: "raw",
        folder: "portfolio/resume",
        public_id: `resume-${Date.now()}.pdf`,
        overwrite: false,
      });

    const updateResult = await pool.query(
      `
        UPDATE site_settings
        SET
          resume_url = $1,
          resume_public_id = $2,
          updated_at = NOW()
        WHERE id = 1
        RETURNING
          id,
          name,
          headline,
          bio,
          email,
          location,
          availability_status,
          profile_image_url,
          profile_image_public_id,
          resume_url,
          resume_public_id,
          current_focus,
          updated_at;
      `,
      [
        newCloudinaryAsset.secure_url,
        newCloudinaryAsset.public_id,
      ]
    );

    if (updateResult.rows.length === 0) {
      await cloudinary.uploader.destroy(
        newCloudinaryAsset.public_id,
        {
          resource_type: "raw",
          invalidate: true,
        }
      );

      return null;
    }

    if (settings.resume_public_id) {
      try {
        await cloudinary.uploader.destroy(
          settings.resume_public_id,
          {
            resource_type: "raw",
            invalidate: true,
          }
        );
      } catch (error) {
        console.error(
          "Old resume could not be deleted:",
          error
        );
      }
    }

    return updateResult.rows[0];
  } catch (error) {
    if (newCloudinaryAsset?.public_id) {
      try {
        await cloudinary.uploader.destroy(
          newCloudinaryAsset.public_id,
          {
            resource_type: "raw",
            invalidate: true,
          }
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up new resume:",
          cleanupError
        );
      }
    }

    throw error;
  }
};

const deleteResume = async () => {
  const settingsResult = await pool.query(`
    SELECT
      id,
      resume_public_id
    FROM site_settings
    WHERE id = 1;
  `);

  if (settingsResult.rows.length === 0) {
    return null;
  }

  const settings = settingsResult.rows[0];

  if (!settings.resume_public_id) {
    return {
      id: settings.id,
      resume_deleted: false,
    };
  }

  await pool.query(`
    UPDATE site_settings
    SET
      resume_url = NULL,
      resume_public_id = NULL,
      updated_at = NOW()
    WHERE id = 1;
  `);

  try {
    await cloudinary.uploader.destroy(
      settings.resume_public_id,
      {
        resource_type: "raw",
        invalidate: true,
      }
    );
  } catch (error) {
    console.error(
      "Cloudinary resume deletion failed:",
      error
    );

    throw error;
  }

  return {
    id: settings.id,
    resume_deleted: true,
    cloudinary_public_id:
      settings.resume_public_id,
  };
};

export default {
  uploadResume,
  deleteResume,
};