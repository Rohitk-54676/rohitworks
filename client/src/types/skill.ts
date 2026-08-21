export interface Skill {
  id: string;
  name: string;
  category: string | null;
  icon_reference: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSkillPayload {
  name: string;
  category?: string | null;
  icon_reference?: string | null;
  display_order?: number;
}

export type UpdateSkillPayload = Partial<CreateSkillPayload>;

export interface SkillApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}