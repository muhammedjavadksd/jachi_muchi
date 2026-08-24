import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks";
import { fetchAddresses, saveAddress, deleteAddress, type BackendAddress } from "@/features/auth/api/addressApi";
import { authApi } from "@/features/auth/api/authApi";
import { applyCoupon, removeCoupon, fetchUserCoupons, markCouponAsUsed } from "@/features/coupon/api/couponApi";
import { fetchCart, mapBackendItem, clearCartApi } from "@/features/cart/api/cartApi";
import type { UserCoupon } from "@/features/coupon/types";
import { createOrder } from "@/features/checkout/api/orderApi";
import { initiateSkipCashPayment } from "@/features/checkout/api/paymentApi";
import { PAYMENT_SESSION_REF_KEY } from "@/features/checkout/constants";
import { getOffers, getComboCartSavings } from "@/shared/services/offerEngine";
import type { Offer } from "@/features/offer/types";

interface CartItem {
  productId: string;
  variantId?: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  mrp?: number;
  setCount?: number;
  quantity?: number;
  freeCount?: number;
  freeUnitPrice?: number;
  isFreeOfferItem?: boolean;
  bogoGroupId?: string;
  color: { name: string; id: string } | null;
  lens: {
    id?: string;
    name: string;
    price: number;
  } | null;
  lensPrice?: number;
  totalPrice: number;
  powerType?: string;
  powerDetails?: {
    leftSPH?: string;
    rightSPH?: string;
    leftCYL?: string | null;
    rightCYL?: string | null;
    isSamePower?: boolean;
    hasCylindrical?: boolean;
    customerName?: string;
    customerPhone?: string;
    knowPowerLater?: boolean;
  } | null;
}

interface NormalizedBill {
  totalItemPrice: number;
  totalDiscount: number;
  offerSavings: number;
  fittingFee: number;
  totalPayable: number;
}

const n = (v: unknown, fallback = 0): number => {
  const num = Number(v);
  return Number.isFinite(num) ? num : fallback;
};

function normalizeBill(raw: Record<string, any> | null | undefined, fallbackTotal: number): NormalizedBill {
  if (!raw) {
    return {
      totalItemPrice: n(fallbackTotal),
      totalDiscount: 0,
      offerSavings: 0,
      fittingFee: 0,
      totalPayable: n(fallbackTotal),
    };
  }
  return {
    totalItemPrice:
      n(raw.totalItemPrice ?? raw.subtotal ?? raw.itemTotal ?? fallbackTotal),
    totalDiscount:
      n(raw.totalDiscount ?? raw.discount),
    offerSavings:
      n(raw.offerSavings ?? raw.offer_discount),
    fittingFee:
      n(raw.fittingFee ?? raw.fitting_fee),
    totalPayable:
      n(raw.totalPayable ?? raw.total ?? fallbackTotal),
  };
}

export interface Address {
  id: string;
  type: "HOME" | "OFFICE" | "OTHER";
  fullAddress: string;
  name: string;
  phone: string;
  deliveryDate: string;
  isSelected: boolean;
}

export interface UseCheckoutReturn {
  cart: CartItem[];
  addresses: Address[];
  addressLoading: boolean;
  offers: Offer[];
  userCoupons: UserCoupon[];
  eligibleCoupons: UserCoupon[];
  usedCoupons: UserCoupon[];
  isCouponListOpen: boolean;
  couponInput: string;
  appliedCoupon: string;
  couponSavings: number;
  couponError: string;
  isApplyingCoupon: boolean;
  copiedCoupon: string | null;
  orderLoading: boolean;
  submitError: string;
  paymentMethod: string;
  subtotal: number;
  totalSellingPrice: number;
  discount: number;
  offerSavings: number;
  totalPayable: number;
  fittingFee: number;
  isModalOpen: boolean;
  editingAddressId: string | null;
  setEditingAddressId: (id: string | null) => void;
  handleSelectAddress: (id: string) => void;
  handleDeleteAddress: (id: string) => void;
  handleAddAddress: (addressData: { name: string; phone: string; addressLine1: string; addressLine2?: string; city: string; state: string; pincode: string; type: "home" | "work" | "other"; isDefault?: boolean }) => Promise<void>;
  handleEditAddress: (id: string, data: { name: string; phone: string; addressLine1: string; addressLine2?: string; city: string; state: string; pincode: string; type: "home" | "work" | "other" }) => Promise<void>;
  handleApplyCoupon: () => Promise<void>;
  handleRemoveCoupon: () => Promise<void>;
  handleCopyCoupon: (code: string) => Promise<void>;
  handleCouponInputChange: (value: string) => void;
  toggleCouponList: () => void;
  setPaymentMethod: (method: string) => void;
  handlePlaceOrder: () => Promise<void>;
  setIsModalOpen: (open: boolean) => void;
  billReady: boolean;
}

export function useCheckout(): UseCheckoutReturn {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderLoading, setOrderLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponSavings, setCouponSavings] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [isCouponListOpen, setIsCouponListOpen] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [normalizedBill, setNormalizedBill] = useState<NormalizedBill | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fittingFee = normalizedBill?.fittingFee ?? 199;
  const subtotal = normalizedBill?.totalItemPrice ?? 0;
  const discount = normalizedBill?.totalDiscount ?? 0;

  const totalComboSavings = useMemo(
    () => getComboCartSavings(cart, offers),
    [cart, offers]
  );

  const offerSavings = (normalizedBill?.offerSavings ?? 0) + Math.round(totalComboSavings);
  const totalSellingPrice = subtotal - discount;
  const displayBillTotalPayable = (normalizedBill?.totalPayable ?? 0) - Math.round(totalComboSavings);
  const totalPayable = useMemo(() => displayBillTotalPayable - couponSavings, [displayBillTotalPayable, couponSavings]);

  const eligibleCoupons = useMemo(() => {
    return userCoupons.filter(coupon => {
      if (coupon.isUsed) return false;
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return false;
      const minReq = coupon.minOrderAmount || 0;
      if (minReq > 0 && totalSellingPrice < minReq) return false;
      return true;
    });
  }, [userCoupons, totalSellingPrice]);

  const usedCoupons = useMemo(() => {
    return userCoupons.filter(coupon => coupon.isUsed);
  }, [userCoupons]);

  const handleApplyCoupon = useCallback(async () => {
    const trimmedCode = couponInput.trim().toUpperCase();
    if (!trimmedCode) {
      setCouponError("Please enter a coupon code");
      return;
    }
    if (appliedCoupon) {
      setCouponError("Please remove the applied coupon first");
      return;
    }
    setIsApplyingCoupon(true);
    setCouponError("");
    try {
      const response = await applyCoupon(trimmedCode, totalSellingPrice);
      setAppliedCoupon(response.couponCode);
      setCouponSavings(response.discount);
      setCouponInput("");
      setCouponError("");
    } catch (error: any) {
      const msg = error.message || "Failed to apply coupon";
      setCouponError(msg);
      const t = await import("react-hot-toast");
      t.toast.error(msg);
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [couponInput, appliedCoupon, totalSellingPrice]);

  const handleRemoveCoupon = useCallback(async () => {
    try {
      if (appliedCoupon) await removeCoupon(appliedCoupon);
    } catch (error) {
      console.error("Failed to remove coupon from backend:", error);
    } finally {
      setAppliedCoupon("");
      setCouponSavings(0);
      setCouponError("");
    }
  }, [appliedCoupon]);

  const handleCopyCoupon = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2000);
      setCouponInput(code);
      setCouponError("");
    } catch {
      // Clipboard API may fail in non-secure contexts; still fill the input
      setCouponInput(code);
      setCouponError("");
    }
  }, []);

  const handleSelectAddress = useCallback((id: string) => {
    setAddresses(prev => prev.map(addr => ({ ...addr, isSelected: addr.id === id })));
  }, []);

  const handleDeleteAddress = useCallback(async (id: string) => {
    try {
      await deleteAddress(id);
      setAddresses(prev => {
        const filtered = prev.filter(addr => addr.id !== id);
        if (filtered.length > 0 && !filtered.some(a => a.isSelected)) filtered[0].isSelected = true;
        return filtered;
      });
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  }, []);

  const handleAddAddress = useCallback(async (addressData: { name: string; phone: string; addressLine1: string; addressLine2?: string; city: string; state: string; pincode: string; type: "home" | "work" | "other"; isDefault?: boolean }) => {
    try {
      const res = await saveAddress({
        name: addressData.name,
        phone: addressData.phone,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2 || undefined,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        type: addressData.type,
      });
      if (res.success && res.data) {
        const typeMap: Record<string, "HOME" | "OFFICE" | "OTHER"> = { home: "HOME", work: "OFFICE", other: "OTHER" };
        const newAddr: Address = {
          id: res.data._id,
          type: typeMap[addressData.type] ?? "HOME",
          fullAddress: `${addressData.addressLine1}${addressData.addressLine2 ? ", " + addressData.addressLine2 : ""}, ${addressData.city}, ${addressData.state} ${addressData.pincode}`,
          name: addressData.name,
          phone: addressData.phone,
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isSelected: true,
        };
        setAddresses(prev => prev.map(a => ({ ...a, isSelected: false })).concat(newAddr));
      }
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  }, []);

  const handleEditAddress = useCallback(async (id: string, data: { name: string; phone: string; addressLine1: string; addressLine2?: string; city: string; state: string; pincode: string; type: "home" | "work" | "other" }) => {
    try {
      const res = await authApi.updateAddress(id, data);
      if (res.success) {
        const typeMap: Record<string, "HOME" | "OFFICE" | "OTHER"> = { home: "HOME", work: "OFFICE", other: "OTHER" };
        setAddresses(prev => prev.map(a => a.id !== id ? a : {
          ...a,
          type: typeMap[data.type] ?? "HOME",
          fullAddress: `${data.addressLine1}${data.addressLine2 ? ", " + data.addressLine2 : ""}, ${data.city}, ${data.state} ${data.pincode}`,
          name: data.name,
          phone: data.phone,
        }));
      }
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  }, []);

  const toggleCouponList = useCallback(() => setIsCouponListOpen(prev => !prev), []);

  const handleCouponInputChange = useCallback((value: string) => {
    setCouponInput(value);
    setCouponError("");
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (orderLoading) return;
    const selectedAddress = addresses.find(a => a.isSelected);
    if (!selectedAddress) { alert("Please select address"); return; }
    if (cart.length === 0) { alert("Your cart is empty"); return; }
    if (!normalizedBill) { alert("Bill is still loading. Please wait a moment and try again."); return; }
    setOrderLoading(true);
    setSubmitError("");

    let latestCart = cart;
    let latestBill = normalizedBill;
    try {
      const backendCart = await fetchCart();
      latestCart = backendCart.items.map(mapBackendItem);
      latestBill = normalizeBill(backendCart.bill, backendCart.total);
      setCart(latestCart);
      setNormalizedBill(latestBill);
    } catch (err) {
      console.warn("Failed to refresh cart before order, using stale state:", err);
    }

    const latestComboSavings = Math.round(getComboCartSavings(latestCart, offers));
    const latestTotalPayable = Math.max(0, n(latestBill.totalPayable) - latestComboSavings - n(couponSavings));

    if (!Number.isFinite(latestTotalPayable) || latestTotalPayable <= 0) {
      console.error("[Place Order] Aborting: totalAmount is not valid:", { latestTotalPayable, latestBill, latestComboSavings, couponSavings });
      setSubmitError("Unable to calculate the order total. Please refresh the page and try again.");
      setOrderLoading(false);
      return;
    }

    const orderPayload = {
      items: latestCart.map(item => ({
        productId: item.productId,
        variantId: item.variantId || item.color?.id || undefined,
        name: item.productName,
        image: item.productImage || "",
        price: n(item.productPrice),
        totalQuantity: Math.max(1, Math.round(n(item.setCount || item.quantity, 1))),
        setCount: Math.max(1, Math.round(n(item.setCount || item.quantity, 1))),
        isFree: item.isFreeOfferItem || undefined,
        freeCount: item.freeCount || undefined,
        freeUnitPrice: item.freeUnitPrice || undefined,
        bogoGroupId: item.bogoGroupId || undefined,
        color: item.color || undefined,
        lens: item.lens ? { id: item.lens.id, name: item.lens.name, price: n(item.lens.price) } : undefined,
        powerDetails: item.powerDetails && Object.keys(item.powerDetails).length > 0 ? item.powerDetails : undefined,
      })),
      addressId: selectedAddress.id,
      totalAmount: latestTotalPayable,
      paymentMethod,
    };
    console.log("[Place Order] payload:", JSON.parse(JSON.stringify(orderPayload)));
    try {
      if (paymentMethod === "ONLINE") {
        if (appliedCoupon) {
          localStorage.setItem("pendingCouponMark", appliedCoupon);
        }
        try {
          const skipCashPayload = {
            items: orderPayload.items,
            addressId: orderPayload.addressId,
            totalAmount: orderPayload.totalAmount,
            couponCode: appliedCoupon || undefined,
          };
          console.log("[SkipCash] payload:", skipCashPayload);
          const { paymentUrl, sessionRef } = await initiateSkipCashPayment(skipCashPayload);
          try {
            localStorage.setItem(PAYMENT_SESSION_REF_KEY, sessionRef);
          } catch {}
          window.location.href = paymentUrl;
          return;
        } catch (error: any) {
          localStorage.removeItem("pendingCouponMark");
          throw error;
        }
      }

      const res = await createOrder(orderPayload);
      if (!res.success) throw new Error("Order failed");
      const orderId = res.data?.orderId;
      if (appliedCoupon && user?.id && orderId) {
        markCouponAsUsed(appliedCoupon, user.id, orderId).catch(() => {});
      }
      await clearCartApi();
      navigate(`/order-success/${orderId}`);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.message || "";
      localStorage.removeItem("pendingCouponMark");
      if (errMsg.toLowerCase().includes("coupon") || errMsg.toLowerCase().includes("already used")) {
        setAppliedCoupon("");
        setCouponSavings(0);
        const t = await import("react-hot-toast");
        t.toast.error("Coupon is no longer valid. Discount has been removed.");
        setSubmitError("Your coupon is no longer valid. It has been removed — please review your bill and try again.");
      } else if (paymentMethod === "ONLINE") {
        setSubmitError(errMsg || "We couldn't start your online payment. Please try again.");
      } else {
        const t = await import("react-hot-toast");
        t.toast.error(errMsg || "Failed to place order. Please try again.");
        setSubmitError(errMsg || "Failed to place order. Please try again.");
      }
    } finally {
      setOrderLoading(false);
    }
  }, [cart, addresses, paymentMethod, normalizedBill, couponSavings, appliedCoupon, user, navigate, offers, orderLoading]);

  useEffect(() => {
    fetchCart()
      .then((backendCart) => {
        setCart(backendCart.items.map(mapBackendItem));
        setNormalizedBill(normalizeBill(backendCart.bill, backendCart.total));
      })
      .catch(() => {
        setCart([]);
        setNormalizedBill(null);
      });
  }, []);

  useEffect(() => {
    getOffers().then(setOffers).catch(() => {});
  }, []);

  useEffect(() => {
    fetchUserCoupons().then(setUserCoupons).catch(() => setUserCoupons([]));
  }, []);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setAddressLoading(true);
        const backendAddresses = await fetchAddresses();
        const mapped: Address[] = backendAddresses.map((addr: BackendAddress, idx: number) => ({
          id: addr._id,
          type: (addr.type === "home" ? "HOME" : addr.type === "work" ? "OFFICE" : "OTHER") as "HOME" | "OFFICE" | "OTHER",
          fullAddress: `${addr.addressLine1}${addr.addressLine2 ? ", " + addr.addressLine2 : ""}, ${addr.city}, ${addr.state} ${addr.pincode}`,
          name: addr.name,
          phone: addr.phone,
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isSelected: addr.isDefault && idx === 0,
        }));
        if (mapped.length > 0 && !mapped.some(a => a.isSelected)) mapped[0].isSelected = true;
        setAddresses(mapped);
      } catch (error) {
        console.error("Failed to load addresses:", error);
      } finally {
        setAddressLoading(false);
      }
    };
    loadAddresses();
  }, []);

  const billReady = normalizedBill !== null;

  return {
    cart,
    addresses,
    addressLoading,
    offers,
    userCoupons,
    eligibleCoupons,
    usedCoupons,
    isCouponListOpen,
    couponInput,
    appliedCoupon,
    couponSavings,
    couponError,
    isApplyingCoupon,
    copiedCoupon,
    orderLoading,
    submitError,
    paymentMethod,
    subtotal,
    totalSellingPrice,
    discount,
    offerSavings,
    totalPayable,
    fittingFee,
    isModalOpen,
    handleSelectAddress,
    handleDeleteAddress,
    handleAddAddress,
    handleEditAddress,
    editingAddressId,
    setEditingAddressId,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleCopyCoupon,
    handleCouponInputChange,
    toggleCouponList,
    setPaymentMethod,
    handlePlaceOrder,
    setIsModalOpen,
    billReady,
  };
}
