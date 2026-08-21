export interface ExperienceTechnology {
  id: string;
  name: string;
  slug: string;
}

export interface Experience {
  id: string;
  organization: string;
  role: string;
  location: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  achievements: string | null;
  display_order: number;
  technologies: ExperienceTechnology[];
  created_at: string;
  updated_at: string;
}

export interface CreateExperiencePayload {
  organization: string;
  role: string;
  location?: string | null;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  achievements?: string | null;
  display_order?: number;
  technology_ids?: string[];
}

export interface UpdateExperiencePayload {
  organization?: string;
  role?: string;
  location?: string | null;
  description?: string | null;
  start_date?: string;
  end_date?: string | null;
  is_current?: boolean;
  achievements?: string | null;
  display_order?: number;
  technology_ids?: string[];
}

export interface ExperienceListResponse {
  success: boolean;
  data: Experience[];
}

export interface ExperienceResponse {
  success: boolean;
  data: Experience;
}