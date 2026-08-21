export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  organization: string | null;
  achievement_date: string | null;
  proof_url: string | null;
  media_url: string | null;
  media_public_id: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAchievementPayload {
  title: string;
  description?: string | null;
  organization?: string | null;
  achievement_date?: string | null;
  proof_url?: string | null;
  display_order?: number;
}

export type UpdateAchievementPayload =
  Partial<CreateAchievementPayload>;

export interface AchievementApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface AchievementMediaResponse {
  id: string;
  media_url: string;
  media_public_id: string;
  updated_at: string;
}

export interface DeleteAchievementMediaResponse {
  id: string;
  media_deleted: boolean;
  cloudinary_public_id?: string;
}