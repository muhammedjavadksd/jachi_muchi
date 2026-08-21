import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks";
import { getMyOrders } from "@/features/checkout/api/orderApi";
import {
  VERIFIED_PURCHASE_EXCLUDED_ORDER_STATUSES,
  VERIFIED_PURCHASE_EXCLUDED_PAYMENT_STATUSES,
} from "@/features/review/constants";

interface MyOrderItem {
  productId?: string | { _id?: string };
}

interface MyOrder {
  status?: string;
  paymentStatus?: string;
  items?: MyOrderItem[];
}

interface UseVerifiedPurchaseResult {
  isVerifiedPurchaser: boolean;
  isCheckingPurchase: boolean;
}

/** Session-level cache so /orders/my is fetched once per product per page load */
const verifiedPurchaseCache = new Map<string, boolean>();

const getOrderItemProductId = (item: MyOrderItem): string => {
  if (!item?.productId) return "";
  if (typeof item.productId === "string") return item.productId;
  return item.productId._id ?? "";
};

const isQualifyingOrder = (order: MyOrder, productId: string): boolean => {
  const orderStatus = (order.status || "").toLowerCase();
  const paymentStatus = (order.paymentStatus || "").toLowerCase();
  const hasProduct = (order.items || []).some(
    (item) => getOrderItemProductId(item) === productId
  );
  return (
    hasProduct &&
    !VERIFIED_PURCHASE_EXCLUDED_ORDER_STATUSES.includes(orderStatus) &&
    !VERIFIED_PURCHASE_EXCLUDED_PAYMENT_STATUSES.includes(paymentStatus)
  );
};

/**
 * Determines whether the logged-in user is a verified purchaser of a product
 * by scanning their own orders for a qualifying order containing it.
 * Fails closed (false) on API errors without caching the result.
 */
export function useVerifiedPurchase(
  productId?: string
): UseVerifiedPurchaseResult {
  const { isAuthenticated } = useAuth();
  const [isVerifiedPurchaser, setIsVerifiedPurchaser] = useState(() =>
    Boolean(productId && verifiedPurchaseCache.get(productId))
  );
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(
    () =>
      Boolean(isAuthenticated && productId) &&
      !verifiedPurchaseCache.has(productId ?? "")
  );

  useEffect(() => {
    if (!productId || !isAuthenticated) {
      setIsVerifiedPurchaser(false);
      setIsCheckingPurchase(false);
      return;
    }

    const cached = verifiedPurchaseCache.get(productId);
    if (cached !== undefined) {
      setIsVerifiedPurchaser(cached);
      setIsCheckingPurchase(false);
      return;
    }

    let cancelled = false;
    setIsCheckingPurchase(true);

    getMyOrders()
      .then((response) => {
        const orders: MyOrder[] = Array.isArray(response?.data)
          ? response.data
          : [];
        const purchased = orders.some((order) =>
          isQualifyingOrder(order, productId)
        );
        verifiedPurchaseCache.set(productId, purchased);
        if (!cancelled) {
          setIsVerifiedPurchaser(purchased);
          setIsCheckingPurchase(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsCheckingPurchase(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId, isAuthenticated]);

  return { isVerifiedPurchaser, isCheckingPurchase };
}
