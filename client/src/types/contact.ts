export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactApiResponse {
  success: boolean;
  data?: unknown;
  message?: string;
  errors?: Record<string, string>;
}