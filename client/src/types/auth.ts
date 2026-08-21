export interface AdminSession {
  authenticated: boolean;
  admin: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthMessageResponse {
  message: string;
}