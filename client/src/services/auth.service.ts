import apiClient from "../api/client";
import type {
  AdminSession,
  AuthMessageResponse,
  LoginPayload,
} from "../types/auth";

const authService = {
  async login(payload: LoginPayload): Promise<AuthMessageResponse> {
    const response = await apiClient.post<{
      success: true;
      data: AuthMessageResponse;
    }>("/auth/login", payload);

    return response.data.data;
  },

  async getMe(): Promise<AdminSession> {
    const response = await apiClient.get<{
      success: true;
      data: AdminSession;
    }>("/auth/me");

    return response.data.data;
  },

  async logout(): Promise<AuthMessageResponse> {
    const response = await apiClient.post<{
      success: true;
      data: AuthMessageResponse;
    }>("/auth/logout");

    return response.data.data;
  },
};

export default authService;