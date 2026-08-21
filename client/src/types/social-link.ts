export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSocialLinkPayload {
  platform: string;
  url: string;
  display_order?: number;
  is_active?: boolean;
}

export type UpdateSocialLinkPayload =
  Partial<CreateSocialLinkPayload>;

export interface SocialLinkApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}