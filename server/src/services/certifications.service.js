import pool from "../db/pool.js";
import cloudinaryService from "./cloudinary.service.js";

const getCertifications = async () => {
  const query = `
    SELECT
      id,
      title,
      issuing_organization,
      TO_CHAR(issue_date, 'YYYY-MM-DD') AS issue_date,
      credential_id,
      credential_url,
      certificate_image_url,
      certificate_image_public_id,
      display_order,
      created_at,
      updated_at
    FROM certifications
    ORDER BY
      display_order ASC,
      issue_date DESC NULLS LAST,
      created_at DESC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};

const getCertificationById = async (id, client = pool) => {
  const query = `
    SELECT
      id,
      title,
      issuing_organization,
      TO_CHAR(issue_date, 'YYYY-MM-DD') AS issue_date,
      credential_id,
      credential_url,
      certificate_image_url,
      certificate_image_public_id,
      display_order,
      created_at,
      updated_at
    FROM certifications
    WHERE id = $1;
  `;

  const { rows } = await client.query(query, [id]);

  return rows[0] || null;
};

const createCertification = async (data) => {
  const {
    title,
    issuing_organization,
    issue_date = null,
    credential_id = null,
    credential_url = null,
    certificate_image_url = null,
    certificate_image_public_id = null,
    display_order = 0,
  } = data;

  const query = `
    INSERT INTO certifications (
      title,
      issuing_organization,
      issue_date,
      credential_id,
      credential_url,
      certificate_image_url,
      certificate_image_public_id,
      display_order
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id;
  `;

  const values = [
    title,
    issuing_organization,
    issue_date,
    credential_id,
    credential_url,
    certificate_image_url,
    certificate_image_public_id,
    display_order,
  ];

  const { rows } = await pool.query(query, values);

  return getCertificationById(rows[0].id);
};

const updateCertification = async (id, data) => {
  const allowedFields = [
    "title",
    "issuing_organization",
    "issue_date",
    "credential_id",
    "credential_url",
    "certificate_image_url",
    "certificate_image_public_id",
    "display_order",
  ];

  const fields = [];
  const values = [];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      values.push(data[field]);
      fields.push(`${field} = $${values.length}`);
    }
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const query = `
    UPDATE certifications
    SET
      ${fields.join(", ")},
      updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING id;
  `;

  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    return null;
  }

  return getCertificationById(rows[0].id);
};

const deleteCertification = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /*
     * Get the certificate image reference
     * before deleting the database record.
     */
    const certificationResult = await client.query(
      `
        SELECT
          id,
          certificate_image_public_id
        FROM certifications
        WHERE id = $1;
      `,
      [id]
    );

    if (certificationResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const certification = certificationResult.rows[0];

    /*
     * Delete the PostgreSQL record first.
     */
    const deleteResult = await client.query(
      `
        DELETE FROM certifications
        WHERE id = $1
        RETURNING id;
      `,
      [id]
    );

    if (deleteResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query("COMMIT");

    /*
     * PostgreSQL deletion succeeded.
     *
     * Cloudinary cleanup happens after COMMIT because
     * Cloudinary cannot participate in the PostgreSQL transaction.
     */
    let cloudinaryCleanupFailed = false;

    if (certification.certificate_image_public_id) {
      try {
        await cloudinaryService.deleteAsset(
          certification.certificate_image_public_id,
          {
            resourceType: "image",
          }
        );
      } catch (error) {
        cloudinaryCleanupFailed = true;

        console.error(
          "Certification deleted but Cloudinary media cleanup failed:",
          {
            certificationId: id,
            cloudinaryPublicId:
              certification.certificate_image_public_id,
            error,
          }
        );
      }
    }

    return {
      id: deleteResult.rows[0].id,
      cloudinary_cleanup_failed:
        cloudinaryCleanupFailed,
    };
  } catch (error) {
    /*
     * PostgreSQL failed.
     *
     * Roll back the transaction.
     * Cloudinary has not been touched.
     */
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export default {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
};