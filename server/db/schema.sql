CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,

    short_description TEXT NOT NULL,
    full_description TEXT,

    thumbnail_url TEXT,
    thumbnail_public_id TEXT,

    github_url TEXT,
    live_url TEXT,

    featured BOOLEAN NOT NULL DEFAULT FALSE,

    status VARCHAR(50) NOT NULL DEFAULT 'completed',

    start_date DATE,
    end_date DATE,

    problem TEXT,
    solution TEXT,
    features TEXT,
    architecture TEXT,
    challenges TEXT,
    results TEXT,
    lessons_learned TEXT,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE project_technologies (
    project_id UUID NOT NULL,
    technology_id UUID NOT NULL,

    PRIMARY KEY (project_id, technology_id),

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE RESTRICT
);



CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    cloudinary_public_id TEXT NOT NULL,
    url TEXT NOT NULL,

    alt_text VARCHAR(255),
    width INTEGER,
    height INTEGER,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);



CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    location VARCHAR(200),

    description TEXT,

    start_date DATE NOT NULL,
    end_date DATE,

    is_current BOOLEAN NOT NULL DEFAULT FALSE,

    achievements TEXT,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT experience_current_end_date_check
        CHECK (
            (is_current = TRUE AND end_date IS NULL)
            OR
            (is_current = FALSE)
        )
);



CREATE TABLE experience_technologies (
    experience_id UUID NOT NULL,
    technology_id UUID NOT NULL,

    PRIMARY KEY (experience_id, technology_id),

    FOREIGN KEY (experience_id)
        REFERENCES experience(id)
        ON DELETE CASCADE,

    FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE RESTRICT
);



CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,

    icon_reference VARCHAR(255),

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT skills_name_category_unique
        UNIQUE (name, category)
);



CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(200) NOT NULL,
    description TEXT,

    organization VARCHAR(200),
    achievement_date DATE,

    proof_url TEXT,

    media_url TEXT,
    media_public_id TEXT,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(200) NOT NULL,
    field VARCHAR(200),

    start_date DATE,
    end_date DATE,

    description TEXT,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(200) NOT NULL,
    issuing_organization VARCHAR(200) NOT NULL,

    issue_date DATE,
    credential_id VARCHAR(200),
    credential_url TEXT,

    certificate_image_url TEXT,
    certificate_image_public_id TEXT,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    platform VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT social_links_platform_unique
        UNIQUE (platform)
);



CREATE TABLE site_settings (
    id SMALLINT PRIMARY KEY DEFAULT 1,

    name VARCHAR(200) NOT NULL,
    headline VARCHAR(300),
    bio TEXT,

    email VARCHAR(320),
    location VARCHAR(200),
    availability_status VARCHAR(100),

    profile_image_url TEXT,
    profile_image_public_id TEXT,

    resume_url TEXT,
    resume_public_id TEXT,

    current_focus TEXT,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT site_settings_singleton
        CHECK (id = 1)
);



CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(200) NOT NULL,
    email VARCHAR(320) NOT NULL,
    subject VARCHAR(300),
    message TEXT NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);




-- Project listing and featured project queries
CREATE INDEX idx_projects_featured_order
    ON projects (featured, display_order);

-- Project image retrieval
CREATE INDEX idx_project_images_project_order
    ON project_images (project_id, display_order);

-- Technology lookup from projects
CREATE INDEX idx_project_technologies_technology
    ON project_technologies (technology_id);

-- Experience listing
CREATE INDEX idx_experience_order
    ON experience (display_order);

-- Technology lookup from experience
CREATE INDEX idx_experience_technologies_technology
    ON experience_technologies (technology_id);

-- Skills listing
CREATE INDEX idx_skills_category_order
    ON skills (category, display_order);

-- Achievement listing
CREATE INDEX idx_achievements_order
    ON achievements (display_order);

-- Education listing
CREATE INDEX idx_education_order
    ON education (display_order);

-- Certification listing
CREATE INDEX idx_certifications_order
    ON certifications (display_order);

-- Social links listing
CREATE INDEX idx_social_links_active_order
    ON social_links (is_active, display_order);

-- Recent/unread contact messages
CREATE INDEX idx_contact_messages_created_at
    ON contact_messages (created_at DESC);

CREATE INDEX idx_contact_messages_unread
    ON contact_messages (is_read, created_at DESC);





CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_sessions_expires_at
ON admin_sessions(expires_at);