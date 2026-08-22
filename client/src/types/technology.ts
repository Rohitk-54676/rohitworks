export interface Technology {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface CreateTechnologyPayload {
  name: string;
  slug: string;
}

export type UpdateTechnologyPayload =
  Partial<CreateTechnologyPayload>;

export interface TechnologyApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}