export type ProjectStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "archived";

export interface ProjectTechnology {
  id: string;
  name: string;
  slug: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  cloudinary_public_id: string;
  url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;

  title: string;
  slug: string;

  short_description: string;
  full_description: string;

  thumbnail_url: string | null;
  thumbnail_cloudinary_public_id: string | null;

  github_url: string | null;
  live_url: string | null;

  featured: boolean;
  status: ProjectStatus;

  start_date: string | null;
  end_date: string | null;

  problem: string | null;
  solution: string | null;
  features: string[] | null;
  architecture: string | null;
  challenges: string | null;
  results: string | null;
  lessons_learned: string | null;

  display_order: number;

  technologies: ProjectTechnology[];
  images: ProjectImage[];

  created_at: string;
  updated_at: string;
}

export interface ProjectListResponse {
  success: true;
  data: Project[];
}

export interface ProjectResponse {
  success: true;
  data: Project;
}

export interface ProjectMutationResponse {
  success: true;
  data: Project;
}