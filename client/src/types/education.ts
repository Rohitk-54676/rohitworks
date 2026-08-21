export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateEducationPayload {
  institution: string;
  degree: string;
  field?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  display_order?: number;
}

export type UpdateEducationPayload = Partial<CreateEducationPayload>;

export interface EducationApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}