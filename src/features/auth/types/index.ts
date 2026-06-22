export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface ApiUser {
  _id?: string;
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    email?: string;
    token?: string;
    user?: ApiUser;
  };
  user?: User;
  token?: string;
}

export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: ApiUser;
  };
  user?: User;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: ApiUser;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  gender?: string;
  avatar?: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data?: UserProfile;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  gender?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface AddressData {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
}

export interface SaveAddressRequest {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work" | "other";
  isDefault?: boolean;
}

export interface AddressListResponse {
  success: boolean;
  message: string;
  data?: AddressData[];
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data?: AddressData;
}

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}

export interface BackendAddress {
  _id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  isDefault: boolean;
}

export interface AddressFormData {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  isDefault?: boolean;
}
