export type { CouponSuccessResponse, CouponErrorResponse, CouponResponse, AvailableCoupon, ApplicableCoupon, UserCoupon, WelcomeCoupon } from "./types";
export { applyCoupon, removeCoupon, validateCoupon, fetchAvailableCoupons, estimateCouponDiscount, fetchApplicableCoupons, fetchUserCoupons, markCouponAsUsed, fetchWelcomeCoupon } from "./api/couponApi";
