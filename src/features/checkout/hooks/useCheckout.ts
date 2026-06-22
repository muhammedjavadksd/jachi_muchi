import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks";
import { fetchAddresses, saveAddress, deleteAddress, type BackendAddress } from "@/features/auth/api/addressApi";
import { validateCoupon, applyCoupon, removeCoupon, fetchUserCoupons, markCouponAsUsed } from "@/features/coupon/api/couponApi";
import type { UserCoupon } from "@/features/coupon/types";
import { createOrder } from "@/features/checkout/api/orderApi";
import { createSkipCashPayment } from "@/features/checkout/api/paymentApi";
import { getOffers } from "@/shared/services/offerEngine";
import type { Offer } from "@/features/offer/types";

interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  mrp?: number;
  quantity?: number;
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
  paymentMethod: string;
  subtotal: number;
  totalSellingPrice: number;
  discount: number;
  totalPayable: number;
  fittingFee: number;
  isModalOpen: boolean;
  handleSelectAddress: (id: string) => void;
  handleDeleteAddress: (id: string) => void;
  handleAddAddress: (addressData: Omit<Address, "id" | "isSelected" | "deliveryDate">) => Promise<void>;
  handleApplyCoupon: () => Promise<void>;
  handleRemoveCoupon: () => Promise<void>;
  handleCopyCoupon: (code: string) => Promise<void>;
  handleCouponInputChange: (value: string) => void;
  toggleCouponList: () => void;
  setPaymentMethod: (method: string) => void;
  handlePlaceOrder: () => Promise<void>;
  setIsModalOpen: (open: boolean) => void;
}

export function useCheckout(): UseCheckoutReturn {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderLoading, setOrderLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponSavings, setCouponSavings] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [isCouponListOpen, setIsCouponListOpen] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fittingFee = 199;
  const subtotal = useMemo(() =>
    cart.reduce((sum, item) => sum + ((item.mrp || item.productPrice) * (item.quantity || 1)) + (item.lens?.price || 0), 0), [cart]);
  const totalSellingPrice = useMemo(() =>
    cart.reduce((sum, item) => sum + (item.productPrice * (item.quantity || 1)) + (item.lens?.price || 0), 0), [cart]);
  const discount = useMemo(() => subtotal - totalSellingPrice, [subtotal, totalSellingPrice]);
  const totalPayable = useMemo(() => totalSellingPrice + fittingFee - couponSavings, [totalSellingPrice, couponSavings]);

  const eligibleCoupons = useMemo(() => {
    return userCoupons.filter(coupon => {
      if (coupon.isUsed) return false;
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return false;
      if (coupon.minPurchase && totalSellingPrice < coupon.minPurchase) return false;
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
      if (msg.toLowerCase().includes("already used")) {
        setCouponError("You've already used this coupon");
      } else {
        setCouponError(msg);
      }
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

      if (appliedCoupon) {
        setCouponError("Please remove the applied coupon first");
        return;
      }

      setCouponInput(code);
      setIsApplyingCoupon(true);
      setCouponError("");

      const response = await applyCoupon(code, totalSellingPrice);
      setAppliedCoupon(response.couponCode);
      setCouponSavings(response.discount);
      setCouponInput("");
    } catch (error: any) {
      const msg = error.message || "Failed to apply coupon";
      if (msg.toLowerCase().includes("already used")) {
        setCouponError("You've already used this coupon");
      } else {
        setCouponError(msg);
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [appliedCoupon, totalSellingPrice]);

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

  const handleAddAddress = useCallback(async (addressData: Omit<Address, "id" | "isSelected" | "deliveryDate">) => {
    try {
      const res = await saveAddress({
        name: addressData.name,
        phone: addressData.phone,
        addressLine1: addressData.fullAddress.split(',')[0],
        addressLine2: addressData.fullAddress.split(',').slice(1, -2).join(',').trim() || undefined,
        city: addressData.fullAddress.split(',').slice(-2)[0].trim(),
        state: addressData.fullAddress.split(' ')[0],
        pincode: addressData.fullAddress.split(' ').slice(-1)[0],
        type: addressData.type === "HOME" ? "home" : addressData.type === "OFFICE" ? "work" : "other",
      });
      if (res.success && res.data) {
        const newAddr: Address = {
          id: res.data._id,
          type: addressData.type,
          fullAddress: addressData.fullAddress,
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

  const toggleCouponList = useCallback(() => setIsCouponListOpen(prev => !prev), []);

  const handleCouponInputChange = useCallback((value: string) => {
    setCouponInput(value);
    setCouponError("");
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    const selectedAddress = addresses.find(a => a.isSelected);
    if (!selectedAddress) { alert("Please select address"); return; }
    if (cart.length === 0) { alert("Your cart is empty"); return; }
    setOrderLoading(true);
    const orderPayload = {
      items: cart.map(item => ({
        productId: item.productId,
        name: item.productName,
        price: item.productPrice,
        quantity: item.quantity || 1,
        color: item.color || undefined,
        lens: item.lens ? { id: item.lens.id, name: item.lens.name, price: item.lens.price } : undefined,
        powerDetails: item.powerDetails || undefined,
      })),
      addressId: selectedAddress.id,
      totalAmount: totalPayable,
      paymentMethod,
    };
    try {
      const res = await createOrder(orderPayload);
      if (!res.success) throw new Error("Order failed");
      if (paymentMethod === "COD") {
        const orderId = res.data?.orderId;
        if (appliedCoupon && user?.id && orderId) {
          markCouponAsUsed(appliedCoupon, user.id, orderId).catch(() => {});
        }
        localStorage.removeItem("cart");
        navigate(`/order-success/${orderId}`);
      } else if (paymentMethod === "ONLINE") {
        const orderId = res.data?.orderId;
        const selectedAddr = addresses.find(a => a.isSelected);
        if (appliedCoupon) {
          localStorage.setItem("pendingCouponMark", appliedCoupon);
        }
        try {
          const paymentRes = await createSkipCashPayment({
            orderId,
            amount: totalPayable,
            customerName: selectedAddr?.name || "Customer",
            email: user?.email || "",
            phone: selectedAddr?.phone || "",
          });
          if (paymentRes.success && paymentRes.data?.paymentUrl) {
            localStorage.removeItem("cart");
            window.location.href = paymentRes.data.paymentUrl;
          } else {
            localStorage.removeItem("pendingCouponMark");
            navigate(`/payment-failed`);
          }
        } catch {
          localStorage.removeItem("pendingCouponMark");
          navigate(`/payment-failed`);
        }
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.message || "";
      if (errMsg.toLowerCase().includes("coupon") || errMsg.toLowerCase().includes("already used")) {
        setAppliedCoupon("");
        setCouponSavings(0);
        const t = await import("react-hot-toast");
        t.toast.error("Coupon is no longer valid. Discount has been removed.");
      } else {
        const t = await import("react-hot-toast");
        t.toast.error("Failed to place order. Please try again.");
      }
    } finally {
      setOrderLoading(false);
    }
  }, [cart, addresses, paymentMethod, totalPayable, appliedCoupon, user, navigate]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
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
    paymentMethod,
    subtotal,
    totalSellingPrice,
    discount,
    totalPayable,
    fittingFee,
    isModalOpen,
    handleSelectAddress,
    handleDeleteAddress,
    handleAddAddress,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleCopyCoupon,
    handleCouponInputChange,
    toggleCouponList,
    setPaymentMethod,
    handlePlaceOrder,
    setIsModalOpen,
  };
}
