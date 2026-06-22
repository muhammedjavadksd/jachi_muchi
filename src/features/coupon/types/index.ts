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

export interface ApplicableCoupon extends AvailableCoupon {
  estimatedDiscount: number;
}

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

export interface WelcomeCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  validDays: number;
  description?: string;
}
