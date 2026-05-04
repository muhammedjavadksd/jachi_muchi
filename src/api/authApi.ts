import axiosInstance from "@/cors/axiosInstance";
import type { SignupRequest, SignupResponse, OtpVerifyRequest, OtpVerifyResponse, LoginRequest, LoginResponse, UserProfileResponse, UpdateProfileRequest } from "@/types";

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>("/auth/signup", data);
    return response.data;
  },

  verifyOtp: async (data: OtpVerifyRequest): Promise<OtpVerifyResponse> => {
    const response = await axiosInstance.post<OtpVerifyResponse>("/auth/verify-otp", data);
    return response.data;
  },

  resendOtp: async (email: string): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>("/auth/resend-otp", { email });
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  getProfile: async (): Promise<UserProfileResponse> => {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.get<UserProfileResponse>("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.put<UserProfileResponse>("/auth/profile", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};