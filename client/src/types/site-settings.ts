export interface SiteSettings {
  id: string;

  name: string | null;
  headline: string | null;
  bio: string | null;
  email: string | null;
  location: string | null;
  availability_status: string | null;
  current_focus: string | null;

  profile_image_url: string | null;
  profile_image_public_id: string | null;

  resume_url: string | null;
  resume_public_id: string | null;

  created_at?: string;
  updated_at?: string;
}

export interface UpdateSiteSettingsPayload {
  name?: string;
  headline?: string;
  bio?: string;
  email?: string;
  location?: string;
  availability_status?: string;
  current_focus?: string;
}

export interface SiteSettingsApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}