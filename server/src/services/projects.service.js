import pool from "../db/pool.js";
import cloudinaryService from "./cloudinary.service.js";

const getProjects = async ({ featured, status } = {}) => {
  const values = [];
  const conditions = [];

  if (featured !== undefined) {
    values.push(featured);
    conditions.push(`p.featured = $${values.length}`);
  }

  if (status !== undefined) {
    values.push(status);
    conditions.push(`p.status = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const query = `
    SELECT
      p.id,
      p.title,
      p.slug,
      p.short_description,
      p.thumbnail_url,
      p.github_url,
      p.live_url,
      p.featured,
      p.status,
      p.start_date,
      p.end_date,
      p.display_order,
      p.created_at,
      p.updated_at,

      COALESCE(
        JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT(
            'id', t.id,
            'name', t.name,
            'slug', t.slug
          )
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS technologies

    FROM projects p

    LEFT JOIN project_technologies pt
      ON p.id = pt.project_id

    LEFT JOIN technologies t
      ON pt.technology_id = t.id

    ${whereClause}

    GROUP BY p.id

    ORDER BY p.display_order ASC, p.created_at DESC;
  `;

  const { rows } = await pool.query(query, values);

  return rows;
};

const getProjectBySlug = async (slug) => {
  const query = `
    SELECT
      p.id,
      p.title,
      p.slug,
      p.short_description,
      p.full_description,
      p.thumbnail_url,
      p.thumbnail_public_id,
      p.github_url,
      p.live_url,
      p.featured,
      p.status,
      p.start_date,
      p.end_date,
      p.problem,
      p.solution,
      p.features,
      p.architecture,
      p.challenges,
      p.results,
      p.lessons_learned,
      p.display_order,
      p.created_at,
      p.updated_at,

      COALESCE(
        (
          SELECT JSON_AGG(
            JSONB_BUILD_OBJECT(
              'id', t.id,
              'name', t.name,
              'slug', t.slug
            )
            ORDER BY t.name ASC
          )
          FROM project_technologies pt
          INNER JOIN technologies t
            ON pt.technology_id = t.id
          WHERE pt.project_id = p.id
        ),
        '[]'
      ) AS technologies,

      COALESCE(
        (
          SELECT JSON_AGG(
            JSONB_BUILD_OBJECT(
              'id', pi.id,
              'cloudinary_public_id', pi.cloudinary_public_id,
              'url', pi.url,
              'alt_text', pi.alt_text,
              'width', pi.width,
              'height', pi.height,
              'display_order', pi.display_order
            )
            ORDER BY pi.display_order ASC, pi.created_at ASC
          )
          FROM project_images pi
          WHERE pi.project_id = p.id
        ),
        '[]'
      ) AS images

    FROM projects p

    WHERE p.slug = $1;
  `;

  const { rows } = await pool.query(query, [slug]);

  return rows[0] || null;
};


const createProject = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      title,
      slug,
      short_description,
      full_description = null,
      thumbnail_url = null,
      thumbnail_public_id = null,
      github_url = null,
      live_url = null,
      featured = false,
      status = "completed",
      start_date = null,
      end_date = null,
      problem = null,
      solution = null,
      features = null,
      architecture = null,
      challenges = null,
      results = null,
      lessons_learned = null,
      display_order = 0,
      technology_ids = [],
    } = data;

    const projectQuery = `
      INSERT INTO projects (
        title,
        slug,
        short_description,
        full_description,
        thumbnail_url,
        thumbnail_public_id,
        github_url,
        live_url,
        featured,
        status,
        start_date,
        end_date,
        problem,
        solution,
        features,
        architecture,
        challenges,
        results,
        lessons_learned,
        display_order
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20
      )
      RETURNING *;
    `;

    const projectValues = [
      title,
      slug,
      short_description,
      full_description,
      thumbnail_url,
      thumbnail_public_id,
      github_url,
      live_url,
      featured,
      status,
      start_date,
      end_date,
      problem,
      solution,
      features,
      architecture,
      challenges,
      results,
      lessons_learned,
      display_order,
    ];

    const { rows } = await client.query(projectQuery, projectValues);

    const project = rows[0];

    if (technology_ids.length > 0) {
      const technologyQuery = `
        INSERT INTO project_technologies (
          project_id,
          technology_id
        )
        SELECT $1, UNNEST($2::uuid[]);
      `;

      await client.query(technologyQuery, [
        project.id,
        technology_ids,
      ]);
    }

    await client.query("COMMIT");

    return getProjectBySlug(project.slug);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


const updateProject = async (id, data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const allowedFields = [
      "title",
      "slug",
      "short_description",
      "full_description",
      "thumbnail_url",
      "thumbnail_public_id",
      "github_url",
      "live_url",
      "featured",
      "status",
      "start_date",
      "end_date",
      "problem",
      "solution",
      "features",
      "architecture",
      "challenges",
      "results",
      "lessons_learned",
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

    const technologyIdsProvided = Object.prototype.hasOwnProperty.call(
      data,
      "technology_ids"
    );

    if (fields.length === 0 && !technologyIdsProvided) {
      await client.query("ROLLBACK");
      return null;
    }

    let project;

    if (fields.length > 0) {
      values.push(id);

      const projectQuery = `
        UPDATE projects
        SET
          ${fields.join(", ")},
          updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING *;
      `;

      const { rows } = await client.query(projectQuery, values);

      if (rows.length === 0) {
        await client.query("ROLLBACK");
        return null;
      }

      project = rows[0];
    } else {
      const { rows } = await client.query(
        `
          SELECT *
          FROM projects
          WHERE id = $1;
        `,
        [id]
      );

      if (rows.length === 0) {
        await client.query("ROLLBACK");
        return null;
      }

      project = rows[0];
    }

    if (technologyIdsProvided) {
      const technologyIds = data.technology_ids;

      await client.query(
        `
          DELETE FROM project_technologies
          WHERE project_id = $1;
        `,
        [id]
      );

      if (technologyIds.length > 0) {
        await client.query(
          `
            INSERT INTO project_technologies (
              project_id,
              technology_id
            )
            SELECT $1, UNNEST($2::uuid[]);
          `,
          [id, technologyIds]
        );
      }
    }

    await client.query("COMMIT");

    return getProjectBySlug(project.slug);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};




const deleteProject = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /*
     * Get all Cloudinary assets belonging to the project
     * before PostgreSQL deletes the records.
     */
    const projectResult = await client.query(
      `
        SELECT
          id,
          thumbnail_public_id
        FROM projects
        WHERE id = $1;
      `,
      [id]
    );

    if (projectResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const project = projectResult.rows[0];

    /*
     * Get all project gallery image public IDs.
     */
    const imagesResult = await client.query(
      `
        SELECT
          cloudinary_public_id
        FROM project_images
        WHERE project_id = $1;
      `,
      [id]
    );

    const cloudinaryPublicIds = [];

    /*
     * Project thumbnail.
     */
    if (project.thumbnail_public_id) {
      cloudinaryPublicIds.push({
        publicId: project.thumbnail_public_id,
        resourceType: "image",
      });
    }

    /*
     * Project gallery images.
     */
    for (const image of imagesResult.rows) {
      if (image.cloudinary_public_id) {
        cloudinaryPublicIds.push({
          publicId: image.cloudinary_public_id,
          resourceType: "image",
        });
      }
    }

    /*
     * Delete the PostgreSQL project.
     *
     * project_images and project_technologies will be
     * removed automatically through ON DELETE CASCADE.
     */
    const deleteResult = await client.query(
      `
        DELETE FROM projects
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
     * Now clean up the corresponding Cloudinary assets.
     *
     * We deliberately do this AFTER COMMIT because Cloudinary
     * cannot participate in the PostgreSQL transaction.
     */
    const cleanupFailures = [];

    for (const asset of cloudinaryPublicIds) {
      try {
        await cloudinaryService.deleteAsset(
          asset.publicId,
          {
            resourceType: asset.resourceType,
          }
        );
      } catch (error) {
        cleanupFailures.push({
          publicId: asset.publicId,
          error,
        });

        console.error(
          "Failed to delete project Cloudinary asset:",
          {
            projectId: id,
            cloudinaryPublicId: asset.publicId,
            error,
          }
        );
      }
    }

    /*
     * The project is already deleted from PostgreSQL.
     *
     * Return cleanup information for observability.
     */
    return {
      id: deleteResult.rows[0].id,
      cloudinary_cleanup_failed:
        cleanupFailures.length > 0,
      cloudinary_cleanup_failures:
        cleanupFailures.map((failure) => ({
          public_id: failure.publicId,
        })),
    };
  } catch (error) {
    /*
     * PostgreSQL operation failed.
     *
     * Roll back the database transaction.
     *
     * No Cloudinary assets have been deleted because
     * Cloudinary cleanup only starts after COMMIT.
     */
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};



export default {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};