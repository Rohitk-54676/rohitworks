import pool from "../db/pool.js";
import cloudinaryService from "./cloudinary.service.js";

const uploadCertificationMedia = async ({
  certificationId,
  file,
}) => {
  /*
   * Get the existing certification and current media reference.
   */
  const certificationResult = await pool.query(
    `
      SELECT
        id,
        certificate_image_url,
        certificate_image_public_id
      FROM certifications
      WHERE id = $1;
    `,
    [certificationId]
  );

  if (certificationResult.rows.length === 0) {
    return null;
  }

  const certification = certificationResult.rows[0];

  let newCloudinaryAsset;

  try {
    /*
     * Upload the new certificate image first.
     */
    newCloudinaryAsset =
      await cloudinaryService.uploadBuffer(
        file.buffer,
        {
          folder: "portfolio/certificates",
          resourceType: "image",
        }
      );

    /*
     * Update PostgreSQL.
     */
    const updateResult = await pool.query(
      `
        UPDATE certifications
        SET
          certificate_image_url = $1,
          certificate_image_public_id = $2,
          updated_at = NOW()
        WHERE id = $3
        RETURNING
          id,
          certificate_image_url,
          certificate_image_public_id,
          updated_at;
      `,
      [
        newCloudinaryAsset.secure_url,
        newCloudinaryAsset.public_id,
        certificationId,
      ]
    );

    if (updateResult.rows.length === 0) {
      /*
       * Database update failed.
       * Remove the newly uploaded Cloudinary asset.
       */
      await cloudinaryService.deleteAsset(
        newCloudinaryAsset.public_id,
        {
          resourceType: "image",
        }
      );

      return null;
    }

    /*
     * PostgreSQL now points to the new certificate image.
     *
     * Delete the old Cloudinary asset if one existed.
     */
    if (certification.certificate_image_public_id) {
      try {
        await cloudinaryService.deleteAsset(
          certification.certificate_image_public_id,
          {
            resourceType: "image",
          }
        );
      } catch (cleanupError) {
        /*
         * New certificate image is already active.
         * The old asset is now orphaned.
         */
        console.error(
          "Certificate image updated but old Cloudinary asset could not be deleted:",
          {
            certificationId,
            oldCloudinaryPublicId:
              certification.certificate_image_public_id,
            newCloudinaryPublicId:
              newCloudinaryAsset.public_id,
            error: cleanupError,
          }
        );
      }
    }

    return updateResult.rows[0];
  } catch (error) {
    /*
     * Cloudinary upload succeeded but PostgreSQL failed.
     * Remove the newly uploaded asset.
     */
    if (newCloudinaryAsset?.public_id) {
      try {
        await cloudinaryService.deleteAsset(
          newCloudinaryAsset.public_id,
          {
            resourceType: "image",
          }
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up new certificate image:",
          cleanupError
        );
      }
    }

    throw error;
  }
};

const deleteCertificationMedia = async (certificationId) => {
  /*
   * Get the current certificate image reference.
   */
  const certificationResult = await pool.query(
    `
      SELECT
        id,
        certificate_image_public_id
      FROM certifications
      WHERE id = $1;
    `,
    [certificationId]
  );

  if (certificationResult.rows.length === 0) {
    return null;
  }

  const certification = certificationResult.rows[0];

  /*
   * No certificate image exists.
   */
  if (!certification.certificate_image_public_id) {
    return {
      id: certification.id,
      media_deleted: false,
    };
  }

  /*
   * Remove the database reference first.
   */
  await pool.query(
    `
      UPDATE certifications
      SET
        certificate_image_url = NULL,
        certificate_image_public_id = NULL,
        updated_at = NOW()
      WHERE id = $1;
    `,
    [certificationId]
  );

  /*
   * Remove Cloudinary asset.
   */
  try {
    await cloudinaryService.deleteAsset(
      certification.certificate_image_public_id,
      {
        resourceType: "image",
      }
    );
  } catch (error) {
    console.error(
      "Certificate image removed from database but Cloudinary deletion failed:",
      {
        certificationId,
        cloudinaryPublicId:
          certification.certificate_image_public_id,
        error,
      }
    );

    throw error;
  }

  return {
    id: certification.id,
    media_deleted: true,
    cloudinary_public_id:
      certification.certificate_image_public_id,
  };
};

export default {
  uploadCertificationMedia,
  deleteCertificationMedia,
};