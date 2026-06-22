import { api } from "@/shared/lib/axios";
import type {
  CouponSuccessResponse,
  CouponResponse,
  AvailableCoupon,
  ApplicableCoupon,
  UserCoupon,
  WelcomeCoupon,
} from "@/features/coupon/types";

function estimateCouponDiscount(
  coupon: AvailableCoupon,
  cartValue: number
): number {
  if (cartValue < coupon.minPurchase) return 0;
  if (coupon.discountType === "fixed") {
    return Math.min(coupon.discountValue, cartValue);
  }
  const raw = (coupon.discountValue / 100) * cartValue;
  return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
}

export async function applyCoupon(couponCode: string, orderAmount: number): Promise<CouponSuccessResponse> {
  try {
    const response = await api.post<CouponResponse>("/coupons/apply", {
      couponCode: couponCode.toUpperCase(),
      orderAmount,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to apply coupon");
    }

    return response.data as CouponSuccessResponse;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Failed to apply coupon");
  }
}

export async function removeCoupon(code: string): Promise<void> {
  try {
    await api.post("/coupons/remove", {
      code: code.toUpperCase(),
    });
  } catch (error: any) {
    console.error("Failed to remove coupon:", error);
  }
}

export async function validateCoupon(code: string): Promise<CouponSuccessResponse> {
  try {
    const response = await api.post<CouponResponse>("/coupons/validate", {
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

export async function fetchAvailableCoupons(): Promise<AvailableCoupon[]> {
  try {
    const response = await api.get<{
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

export async function fetchApplicableCoupons(
  cartValue: number
): Promise<ApplicableCoupon[]> {
  try {
    const response = await api.get<{
      success: boolean;
      data: ApplicableCoupon[];
    }>("/coupons/applicable", { params: { cartValue } });

    if (response.data.success) {
      return (response.data.data || []).sort(
        (a, b) => b.estimatedDiscount - a.estimatedDiscount
      );
    }
    throw new Error("Failed to fetch applicable coupons");
  } catch {
    const all = await fetchAvailableCoupons();
    const now = new Date();
    return all
      .filter((c) => {
        if (cartValue < c.minPurchase) return false;
        if (new Date(c.expiresAt) < now) return false;
        return true;
      })
      .map((c) => ({
        ...c,
        estimatedDiscount: estimateCouponDiscount(c, cartValue),
      }))
      .sort((a, b) => b.estimatedDiscount - a.estimatedDiscount);
  }
}

export async function fetchUserCoupons(): Promise<UserCoupon[]> {
  try {
    const response = await api.get<{
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

export async function markCouponAsUsed(
  couponCode: string,
  userId: string,
  orderId: string
): Promise<void> {
  try {
    await api.post("/coupons/mark-used", {
      couponCode: couponCode.toUpperCase(),
      userId,
      orderId,
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Failed to mark coupon as used");
  }
}

export async function fetchWelcomeCoupon(): Promise<WelcomeCoupon> {
  try {
    const response = await api.get<{
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
