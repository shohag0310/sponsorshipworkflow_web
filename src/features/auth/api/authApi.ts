import { api } from "../../../api/client";
import type { LoginCredentials, LoginResponse } from "../types/auth";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await api.post("/auth/login", credentials);
    // The backend returns BaseResponse<LoginResponse>, so we need to extract the data
    return res.data.data as LoginResponse;
  },
};