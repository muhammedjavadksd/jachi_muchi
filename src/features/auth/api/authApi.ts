import { api } from "@/shared/lib/axios";
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
} from "@/features/auth/types";

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>("/auth/signup", data);
    return response.data;
  },

  verifyOtp: async (data: OtpVerifyRequest): Promise<OtpVerifyResponse> => {
    const response = await api.post<OtpVerifyResponse>("/auth/verify-otp", data);
    return response.data;
  },

  resendOtp: async (email: string): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>("/auth/resend-otp", { email });
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await api.get<UserProfileResponse>("/auth/profile");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    const response = await api.put<UserProfileResponse>("/auth/profile", data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await api.post<ChangePasswordResponse>("/auth/change-password", data);
    return response.data;
  },

  getAddresses: async (invalidId?: string): Promise<AddressListResponse> => {
    if (invalidId) {
      console.warn(
        "[authApi.getAddresses] called with an ID parameter — did you mean to pass address._id instead of userId?",
        { passed: invalidId }
      );
    }
    const response = await api.get<AddressListResponse>("/address");
    return response.data;
  },

  addAddress: async (data: SaveAddressRequest): Promise<AddressResponse> => {
    const response = await api.post<AddressResponse>("/address", data);
    return response.data;
  },

  updateAddress: async (id: string, data: SaveAddressRequest): Promise<AddressResponse> => {
    const response = await api.put<AddressResponse>(`/address/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<DeleteAddressResponse> => {
    const response = await api.delete<DeleteAddressResponse>(`/address/${id}`);
    return response.data;
  },

  setDefaultAddress: async (id: string): Promise<AddressResponse> => {
    const response = await api.put<AddressResponse>(`/address/${id}/default`, {});
    return response.data;
  },
};
