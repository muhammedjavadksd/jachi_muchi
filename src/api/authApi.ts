import axiosInstance from "@/cors/axiosInstance";
import type { SignupRequest, SignupResponse } from "@/types";

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>("/auth/signup", data);
    return response.data;
  },
};