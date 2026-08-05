import { memo, useRef, useState, useCallback } from "react";
import { Footer, WhatsAppButton, PromotionHeader } from "@/components";
import { Container } from "@/shared/components/Container/Container";
import { useCheckout } from "@/features/checkout/hooks";
import type { UserCoupon } from "@/features/coupon/types";

const PROMOTION_HEADER_HEIGHT = 140;

const CHECKOUT_STEPS = [
  { id: "login", label: "Login/Signup" },
  { id: "address", label: "Shipping Address" },
  { id: "payment", label: "Payment" },
  { id: "summary", label: "Summary" },
];

interface AddAddressInput {
  type: "HOME" | "OFFICE" | "OTHER";
  fullAddress: string;
  name: string;
  phone: string;
}

const AddAddressModal = memo(function AddAddressModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddAddressInput) => void;
}): JSX.Element | null {
  const [formData, setFormData] = useState({
    type: "HOME" as "HOME" | "OFFICE" | "OTHER",
    fullAddress: "",
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleTypeSelect = useCallback((type: "HOME" | "OFFICE" | "OTHER") => {
    setFormData(prev => ({ ...prev, type }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type: formData.type,
      fullAddress: `${formData.fullAddress}, ${formData.city}, ${formData.state} ${formData.pincode}`,
      name: formData.name,
      phone: formData.phone,
    });
    onClose();
  }, [formData, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">Add New Address</h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
            <div className="flex gap-3">
              {(["HOME", "OFFICE", "OTHER"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${formData.type === type
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter your name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter phone number" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" placeholder="House No., Building, Street, Area" rows={3} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Pincode" maxLength={6} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="City" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="State" required />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition-colors text-base">Save Address</button>
        </form>
      </div>
    </div>
  );
});

AddAddressModal.displayName = "AddAddressModal";

const CouponCardCopyOnly = memo(function CouponCardCopyOnly({
  coupon,
  isUsed,
  onCopy,
  copiedCode,
}: {
  coupon: UserCoupon;
  isUsed?: boolean;
  onCopy: (code: string) => void;
  copiedCode: string | null;
}) {
  const isCopied = copiedCode === coupon.code;

  const getDiscountText = () => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `Flat ₹${coupon.discountValue} OFF`;
    }
  };

  return (
    <div className={`border rounded-xl p-4 transition-all bg-white ${isUsed ? "border-gray-200 opacity-60" : "border-gray-200 hover:border-teal-300"}`}>
      <div className="flex justify-between items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`font-mono text-lg font-bold ${isUsed ? "text-gray-400" : "text-gray-900"}`}>{coupon.code}</span>
            <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
              {getDiscountText()}
            </span>
            {isUsed && (
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                Already Used
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {coupon.minPurchase && coupon.minPurchase > 0 && (
              <span>Min. spend ₹{coupon.minPurchase}</span>
            )}
            {coupon.maxDiscount && coupon.discountType === 'percentage' && (
              <span>Max discount ₹{coupon.maxDiscount}</span>
            )}
            {coupon.expiresAt && new Date(coupon.expiresAt) > new Date() && (
              <span>Valid till {new Date(coupon.expiresAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        {isUsed ? (
          <span className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed">
            Used
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCopy(coupon.code);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isCopied
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
            }`}
          >
            {isCopied ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Code
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
});

CouponCardCopyOnly.displayName = "CouponCardCopyOnly";

const CustomCouponSection = memo(function CustomCouponSection({
  appliedCoupon,
  couponSavings,
  couponError,
  isApplyingCoupon,
  couponInput,
  onApplyCoupon,
  onRemoveCoupon,
  onCouponInputChange,
}: {
  appliedCoupon: string;
  couponSavings: number;
  couponError: string;
  isApplyingCoupon: boolean;
  couponInput: string;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onCouponInputChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !appliedCoupon && couponInput.trim()) {
      e.preventDefault();
      onApplyCoupon();
    }
  };

  if (appliedCoupon) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-semibold text-teal-700">{appliedCoupon}</span>
              <span className="text-sm text-teal-600 ml-2">-₹{couponSavings}</span>
            </div>
          </div>
          <button
            onClick={onRemoveCoupon}
            className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-all"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={couponInput}
            onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter coupon code"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all uppercase"
            disabled={isApplyingCoupon}
          />
        </div>
        <button
          onClick={onApplyCoupon}
          disabled={!couponInput.trim() || isApplyingCoupon}
          className="px-6 py-3 bg-teal-700 text-white font-semibold rounded-xl hover:bg-teal-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95"
        >
          {isApplyingCoupon ? "Applying..." : "Apply"}
        </button>
      </div>
      {couponError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {couponError}
        </p>
      )}
      {!couponInput && !appliedCoupon && (
        <p className="text-xs text-gray-400">Enter a coupon code and click Apply</p>
      )}
    </div>
  );
});

CustomCouponSection.displayName = "CustomCouponSection";

export const CheckoutPage = memo(function CheckoutPage(): JSX.Element {
  const {
    addresses,
    addressLoading,
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
  } = useCheckout();

  const currentStep = "address";

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={{ height: `${PROMOTION_HEADER_HEIGHT}px` }} />

      <main className="flex-1 py-6 md:py-10">
        <Container>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 px-1">
            {CHECKOUT_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <span className={`text-sm font-medium whitespace-nowrap ${step.id === currentStep ? "text-gray-900" : "text-gray-400"}`}>
                  {step.label}
                </span>
                {index < CHECKOUT_STEPS.length - 1 && (
                  <svg className="w-4 h-4 mx-2 sm:mx-3 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <div className="flex-1">
              <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-3 w-full sm:w-auto mx-auto lg:mx-0 mb-8 px-8 py-4 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all active:scale-95 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New Delivery Address
              </button>

              {addressLoading ? (
                <div className="text-center py-12 text-gray-500">Loading addresses...</div>
              ) : (
                <>
                  {addresses.map((address) => (
                    <div key={address.id} onClick={() => handleSelectAddress(address.id)} className={`bg-white border-2 rounded-2xl p-5 mb-4 cursor-pointer transition-all ${address.isSelected ? "border-teal-600 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="flex items-start justify-between mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                          {address.type}
                        </span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${address.isSelected ? "border-teal-600 bg-teal-600" : "border-gray-300"}`}>
                          {address.isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium leading-snug mb-3">{address.fullAddress}</p>
                      <p className="text-gray-700 mb-4">{address.name}</p>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <span>{address.phone}</span>
                      </div>
                      <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-5">
                        <span className="text-gray-600 text-sm">Get it by {address.deliveryDate}</span>
                        <div className="flex items-center gap-5 text-sm">
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address.id); }} className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                          <button onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-gray-700 font-medium">Edit</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No addresses added yet. Please add a delivery address.</div>
                  )}
                </>
              )}
            </div>

            <div className="lg:w-96 lg:shrink-0">
              <div className="lg:sticky lg:top-[180px]">
                <h2 className="text-2xl font-semibold text-gray-900 mb-5 px-1">Bill Details</h2>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700 font-medium">You're saving ₹{discount} on this order</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Total MRP</span><span className="font-medium">₹{subtotal}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Discount</span><span className="text-green-600 font-medium">-₹{discount}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Fitting Fee</span><span>₹{fittingFee}</span></div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Coupon ({appliedCoupon})</span>
                        <span className="text-green-600">-₹{couponSavings}</span>
                      </div>
                    )}
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-semibold text-lg">Total Payable</span>
                      <span className="font-bold text-2xl text-gray-900">₹{totalPayable}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
                  <div className="flex items-center justify-between cursor-pointer" onClick={toggleCouponList}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Apply Coupon</h3>
                        <p className="text-xs text-gray-500">Copy & paste coupon code</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isCouponListOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div className="mt-4">
                    <CustomCouponSection
                      appliedCoupon={appliedCoupon}
                      couponSavings={couponSavings}
                      couponError={couponError}
                      isApplyingCoupon={isApplyingCoupon}
                      couponInput={couponInput}
                      onApplyCoupon={handleApplyCoupon}
                      onRemoveCoupon={handleRemoveCoupon}
                      onCouponInputChange={handleCouponInputChange}
                    />
                  </div>

                  {userCoupons.length > 0 && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCouponListOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                      <div className="pt-4 border-t border-gray-100">
                        {(eligibleCoupons.length > 0 || usedCoupons.length > 0) ? (
                          <div className="space-y-3">
                            {eligibleCoupons.map((coupon) => (
                              <CouponCardCopyOnly
                                key={coupon.code}
                                coupon={coupon}
                                onCopy={handleCopyCoupon}
                                copiedCode={copiedCoupon}
                              />
                            ))}
                            {usedCoupons.map((coupon) => (
                              <CouponCardCopyOnly
                                key={`used-${coupon.code}`}
                                coupon={coupon}
                                isUsed={true}
                                onCopy={handleCopyCoupon}
                                copiedCode={copiedCoupon}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500">No coupons available for current cart value</p>
                            {userCoupons.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1">Add more items to unlock coupons</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
                  <p className="font-semibold text-gray-900 mb-3">Payment Method</p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="w-4 h-4 text-teal-600" />
                      <span className="text-sm text-gray-700">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="paymentMethod" value="ONLINE" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} className="w-4 h-4 text-teal-600" />
                      <span className="text-sm text-gray-700">Pay with SkipCash</span>
                    </label>
                  </div>
                </div>

                <button
                  disabled={orderLoading}
                  onClick={handlePlaceOrder}
                  className="mt-6 w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-2xl text-base transition-all active:scale-[0.985] disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {orderLoading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
      <AddAddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddAddress} />
    </div>
  );
});

CheckoutPage.displayName = "CheckoutPage";
