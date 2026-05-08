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
    const response = await axiosInstance.post<CouponResponse>("/apply-coupon", {
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
    await axiosInstance.post("/coupon/remove", {
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
    const response = await axiosInstance.post<CouponResponse>("/coupon/validate", {
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
