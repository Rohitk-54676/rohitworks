export interface Certification {
  id: string;
  title: string;
  issuing_organization: string;
  issue_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  certificate_image_url: string | null;
  certificate_image_public_id: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCertificationPayload {
  title: string;
  issuing_organization: string;
  issue_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  display_order?: number;
}

export type UpdateCertificationPayload =
  Partial<CreateCertificationPayload>;

export interface CertificationApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface CertificationMediaResponse {
  id: string;
  certificate_image_url: string;
  certificate_image_public_id: string;
  updated_at: string;
}

export interface DeleteCertificationMediaResponse {
  id: string;
  media_deleted: boolean;
  cloudinary_public_id?: string;
}