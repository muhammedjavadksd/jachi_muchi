import axiosInstance from "@/cors/axiosInstance";
import type {
  SignupRequest,
  SignupResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  LoginRequest,
  LoginResponse,
  UserProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  SaveAddressRequest,
  AddressResponse,
  AddressListResponse,
  DeleteAddressResponse,
} from "@/types";

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

  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.post<ChangePasswordResponse>("/auth/change-password", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getAddresses: async (): Promise<AddressListResponse> => {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.get<AddressListResponse>("/address", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  addAddress: async (data: SaveAddressRequest): Promise<AddressResponse> => {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.post<AddressResponse>("/address", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateAddress: async (id: string, data: SaveAddressRequest): Promise<AddressResponse> => {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.put<AddressResponse>(`/address/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteAddress: async (id: string): Promise<DeleteAddressResponse> => {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.delete<DeleteAddressResponse>(`/address/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  setDefaultAddress: async (id: string): Promise<AddressResponse> => {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.put<AddressResponse>(`/address/${id}/default`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};