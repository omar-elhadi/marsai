import { apiClient } from "./apiClient";
import { User, LoginCredentials } from "../../types";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post<{ user: User }>(
      "/auth/login",
      credentials,
    );
    return data;
  },
  logout: async () => {
    const { data } = await apiClient.post("/auth/logout");
    return data;
  },
  me: async () => {
    const { data } = await apiClient.get<{ user: User }>("/auth/me");
    return data;
  },
  verifyToken: async (token: string) => {
    const { data } = await apiClient.post<{ user: User }>(
      "/auth/verify-token",
      { token },
    );
    return data;
  },
};
