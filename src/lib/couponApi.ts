import axiosInstance from "@/cors/axiosInstance";

/**
 * Coupon API Response Types
 */
export interface CouponSuccessResponse {
  success: true;
  message: string;
  discount: number;
  finalAmount: number;
  couponCode: string;
}

export interface CouponErrorResponse {
  success: false;
  message: string;
}

export type CouponResponse = CouponSuccessResponse | CouponErrorResponse;

/**
 * Apply coupon code
 * @param couponCode - Coupon code entered by user
 * @param orderAmount - Current order total (before coupon)
 * @returns Promise with coupon response
 */
export async function applyCoupon(couponCode: string, orderAmount: number): Promise<CouponSuccessResponse> {
  try {
    const response = await axiosInstance.post<CouponResponse>("/coupons/apply", {
      couponCode: couponCode.toUpperCase(),
      orderAmount,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to apply coupon");
    }

    return response.data as CouponSuccessResponse;
  } catch (error: any) {
    // Handle axios error response
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Failed to apply coupon");
  }
}

/**
 * Remove/Invalidate applied coupon
 */
export async function removeCoupon(code: string): Promise<void> {
  try {
    await axiosInstance.post("/coupons/remove", {
      code: code.toUpperCase(),
    });
  } catch (error: any) {
    console.error("Failed to remove coupon:", error);
    // Don't throw - removal is best effort
  }
}

/**
 * Validate coupon without applying (optional feature)
 */
export async function validateCoupon(code: string): Promise<CouponSuccessResponse> {
  try {
    const response = await axiosInstance.post<CouponResponse>("/coupons/validate", {
      code: code.toUpperCase(),
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Invalid coupon");
    }

    return response.data as CouponSuccessResponse;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Failed to validate coupon");
  }
}

/**
 * Fetch all available coupons for homepage
 * GET /available-coupons
 */
export interface AvailableCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  description?: string;
  expiresAt: string;
  isNewUserOnly?: boolean;
}

export async function fetchAvailableCoupons(): Promise<AvailableCoupon[]> {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      data: AvailableCoupon[];
    }>("/coupons/available");

    if (!response.data.success) {
      throw new Error("Failed to fetch coupons");
    }

    return response.data.data || [];
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Failed to fetch available coupons");
  }
}

/**
 * Fetch user-specific coupons (assigned to logged-in user)
 * GET /coupons/user
 */
export interface UserCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  description?: string;
  expiresAt: string;
  isUsed?: boolean;
  usedAt?: string;
  assignedAt: string;
}

export async function fetchUserCoupons(): Promise<UserCoupon[]> {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      data: UserCoupon[];
    }>("/coupons/user");

    if (!response.data.success) {
      throw new Error("Failed to fetch user coupons");
    }

    return response.data.data || [];
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Failed to fetch user coupons");
  }
}

/**
 * Get welcome coupon for new users
 * GET /welcome-coupon
 */
export interface WelcomeCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  validDays: number;
  description?: string;
}

export async function fetchWelcomeCoupon(): Promise<WelcomeCoupon> {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      data: WelcomeCoupon;
    }>("/coupons/welcome");

    if (!response.data.success) {
      throw new Error("Failed to fetch welcome coupon");
    }

    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Failed to fetch welcome coupon");
  }
}
