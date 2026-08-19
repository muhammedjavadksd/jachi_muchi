import { memo, useRef, useState, useCallback, useEffect } from "react";
import { Footer, WhatsAppButton, PromotionHeader } from "@/components";
import { Container } from "@/shared/components/Container/Container";
import { useCheckout } from "@/features/checkout/hooks";
import { CouponModal } from "@/features/checkout/components/CouponModal/CouponModal";

const PROMOTION_HEADER_HEIGHT = 140;

const CHECKOUT_STEPS = [
  { id: "login", label: "Login/Signup" },
  { id: "address", label: "Shipping Address" },
  { id: "payment", label: "Payment" },
  { id: "summary", label: "Summary" },
];

interface CountryEntry {
  name: string;
  code: string;
  flag: string;
  digits: number | [number, number];
}

const COUNTRIES: CountryEntry[] = [
  { name: "Afghanistan", code: "+93", flag: "🇦🇫", digits: 9 },
  { name: "Albania", code: "+355", flag: "🇦🇱", digits: 9 },
  { name: "Algeria", code: "+213", flag: "🇩🇿", digits: 9 },
  { name: "Argentina", code: "+54", flag: "🇦🇷", digits: 10 },
  { name: "Australia", code: "+61", flag: "🇦🇺", digits: 9 },
  { name: "Austria", code: "+43", flag: "🇦🇹", digits: [4, 13] },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩", digits: 10 },
  { name: "Belgium", code: "+32", flag: "🇧🇪", digits: 9 },
  { name: "Brazil", code: "+55", flag: "🇧🇷", digits: 11 },
  { name: "Canada", code: "+1", flag: "🇨🇦", digits: 10 },
  { name: "China", code: "+86", flag: "🇨🇳", digits: 11 },
  { name: "Egypt", code: "+20", flag: "🇪🇬", digits: 10 },
  { name: "France", code: "+33", flag: "🇫🇷", digits: 9 },
  { name: "Germany", code: "+49", flag: "🇩🇪", digits: [10, 11] },
  { name: "India", code: "+91", flag: "🇮🇳", digits: 10 },
  { name: "Indonesia", code: "+62", flag: "🇮🇩", digits: [9, 12] },
  { name: "Italy", code: "+39", flag: "🇮🇹", digits: [9, 10] },
  { name: "Japan", code: "+81", flag: "🇯🇵", digits: 10 },
  { name: "Malaysia", code: "+60", flag: "🇲🇾", digits: [9, 10] },
  { name: "Mexico", code: "+52", flag: "🇲🇽", digits: 10 },
  { name: "Nepal", code: "+977", flag: "🇳🇵", digits: 10 },
  { name: "Netherlands", code: "+31", flag: "🇳🇱", digits: 9 },
  { name: "Nigeria", code: "+234", flag: "🇳🇬", digits: 10 },
  { name: "Pakistan", code: "+92", flag: "🇵🇰", digits: 10 },
  { name: "Philippines", code: "+63", flag: "🇵🇭", digits: 10 },
  { name: "Qatar", code: "+974", flag: "🇶🇦", digits: 8 },
  { name: "Russia", code: "+7", flag: "🇷🇺", digits: 10 },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", digits: 9 },
  { name: "Singapore", code: "+65", flag: "🇸🇬", digits: 8 },
  { name: "South Africa", code: "+27", flag: "🇿🇦", digits: 9 },
  { name: "South Korea", code: "+82", flag: "🇰🇷", digits: [9, 10] },
  { name: "Spain", code: "+34", flag: "🇪🇸", digits: 9 },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰", digits: 9 },
  { name: "Thailand", code: "+66", flag: "🇹🇭", digits: 9 },
  { name: "Turkey", code: "+90", flag: "🇹🇷", digits: 10 },
  { name: "UAE", code: "+971", flag: "🇦🇪", digits: 9 },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", digits: 10 },
  { name: "United States", code: "+1", flag: "🇺🇸", digits: 10 },
  { name: "Vietnam", code: "+84", flag: "🇻🇳", digits: 9 },
];

const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.code === "+91")!;

function getPhoneError(phone: string, country: CountryEntry): string {
  if (!phone) return "";
  const { digits, name } = country;
  if (typeof digits === "number") {
    if (phone.length !== digits) return `${name} numbers are ${digits} digits. You entered ${phone.length}.`;
  } else {
    const [min, max] = digits;
    if (phone.length < min || phone.length > max) return `${name} numbers are ${min}–${max} digits. You entered ${phone.length}.`;
  }
  return "";
}

interface AddressFormErrors {
  name?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

const EMPTY_FORM = { name: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", type: "home" as "home" | "work" | "other" };

const AddAddressModal = memo(function AddAddressModal({
  isOpen,
  isEditing,
  initialData,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  isEditing?: boolean;
  initialData?: { name: string; phone: string; fullAddress: string; type: "HOME" | "OFFICE" | "OTHER" };
  onClose: () => void;
  onSave: (data: { name: string; phone: string; addressLine1: string; addressLine2?: string; city: string; state: string; pincode: string; type: "home" | "work" | "other" }) => void;
}): JSX.Element | null {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [selectedCountry, setSelectedCountry] = useState<CountryEntry>(DEFAULT_COUNTRY);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AddressFormErrors>({});
  const [saving, setSaving] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Pre-populate when editing
  useEffect(() => {
    if (isOpen && isEditing && initialData) {
      const storedPhone = initialData.phone || "";
      const matched = COUNTRIES.find((c) => storedPhone.startsWith(c.code));
      const country = matched ?? DEFAULT_COUNTRY;
      const numberPart = matched ? storedPhone.slice(matched.code.length) : storedPhone;
      // Parse fullAddress back into fields (best-effort)
      const parts = initialData.fullAddress.split(",").map(s => s.trim());
      const statePin = parts[parts.length - 1] ?? "";
      const statePinParts = statePin.split(" ").filter(Boolean);
      const pincode = statePinParts[statePinParts.length - 1] ?? "";
      const state = statePinParts.slice(0, -1).join(" ");
      const city = parts[parts.length - 2] ?? "";
      const addressLine1 = parts[0] ?? "";
      const addressLine2 = parts.slice(1, parts.length - 2).join(", ");
      const typeMap: Record<string, "home" | "work" | "other"> = { HOME: "home", OFFICE: "work", OTHER: "other" };
      setSelectedCountry(country);
      setFormData({ name: initialData.name, phone: numberPart, addressLine1, addressLine2, city, state, pincode, type: typeMap[initialData.type] ?? "home" });
      setPhoneError("");
      setFieldErrors({});
    } else if (isOpen && !isEditing) {
      setFormData(EMPTY_FORM);
      setSelectedCountry(DEFAULT_COUNTRY);
      setPhoneError("");
      setFieldErrors({});
    }
  }, [isOpen, isEditing, initialData]);

  const filteredCountries = COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.code.includes(countrySearch)
  );

  useEffect(() => {
    if (!showCountryDropdown) return;
    const handler = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node))
        setShowCountryDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCountryDropdown]);

  const handleClose = useCallback(() => {
    setFormData(EMPTY_FORM);
    setSelectedCountry(DEFAULT_COUNTRY);
    setCountrySearch("");
    setPhoneError("");
    setFieldErrors({});
    onClose();
  }, [onClose]);

  const validate = useCallback((): AddressFormErrors => {
    const errs: AddressFormErrors = {};
    const name = formData.name.trim();
    if (!name) errs.name = "Full name is required.";
    else if (name.length < 2) errs.name = "Name must be at least 2 characters.";
    else if (name.length > 50) errs.name = "Name must be 50 characters or fewer.";
    if (!formData.phone) errs.phone = "Phone number is required.";
    else { const pErr = getPhoneError(formData.phone, selectedCountry); if (pErr) errs.phone = pErr; }
    if (!formData.addressLine1.trim()) errs.addressLine1 = "Address line 1 is required.";
    if (!formData.city.trim()) errs.city = "City is required.";
    if (!formData.state.trim()) errs.state = "State is required.";
    const pin = formData.pincode.trim();
    if (!pin) errs.pincode = "Pincode is required.";
    else if (!/^\d{6}$/.test(pin)) errs.pincode = "Pincode must be exactly 6 digits.";
    return errs;
  }, [formData, selectedCountry]);

  const handleSubmit = useCallback(async () => {
    const errs = validate();
    setFieldErrors(errs);
    if (errs.phone) setPhoneError(errs.phone);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    await onSave({
      name: formData.name.trim(),
      phone: `${selectedCountry.code}${formData.phone}`,
      addressLine1: formData.addressLine1.trim(),
      addressLine2: formData.addressLine2.trim() || undefined,
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      type: formData.type,
    });
    setSaving(false);
    handleClose();
  }, [formData, selectedCountry, validate, onSave, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">{isEditing ? "Edit Delivery Address" : "Add New Delivery Address"}</h2>
          <button onClick={handleClose} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => { setFormData(p => ({ ...p, name: e.target.value })); setFieldErrors(p => ({ ...p, name: undefined })); }}
              className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${fieldErrors.name ? "border-red-400" : "border-gray-300"}`}
              placeholder="Enter full name"
            />
            {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <div className="flex gap-2">
              <div className="relative shrink-0" ref={countryDropdownRef}>
                <button
                  type="button"
                  onClick={() => { setShowCountryDropdown(p => !p); setCountrySearch(""); }}
                  className="h-full min-w-[90px] flex items-center gap-1 rounded-2xl border border-gray-300 bg-white px-3 py-3.5 text-sm text-gray-700 hover:border-teal-500 focus:outline-none transition-colors"
                >
                  <span className="text-base leading-none">{selectedCountry.flag}</span>
                  <span className="font-medium">{selectedCountry.code}</span>
                  <svg className="w-3 h-3 text-gray-400 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCountryDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg z-[200] overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        autoFocus
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search country or code…"
                        className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
                      />
                    </div>
                    <ul className="max-h-48 overflow-y-auto">
                      {filteredCountries.length === 0 ? (
                        <li className="px-3 py-2 text-sm text-gray-400">No results</li>
                      ) : filteredCountries.map((c) => (
                        <li
                          key={`${c.code}-${c.name}`}
                          onClick={() => { setSelectedCountry(c); setShowCountryDropdown(false); setPhoneError(getPhoneError(formData.phone, c)); setFieldErrors(p => ({ ...p, phone: undefined })); }}
                          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 transition-colors"
                        >
                          <span className="text-base leading-none">{c.flag}</span>
                          <span className="font-medium text-gray-800">{c.code}</span>
                          <span className="text-gray-500">{c.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <input
                type="tel"
                inputMode="numeric"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData(p => ({ ...p, phone: val }));
                  const pErr = getPhoneError(val, selectedCountry);
                  setPhoneError(pErr);
                  setFieldErrors(p => ({ ...p, phone: undefined }));
                }}
                className={`flex-1 px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${phoneError || fieldErrors.phone ? "border-red-400" : "border-gray-300"}`}
                placeholder="Phone number"
              />
            </div>
            {(phoneError || fieldErrors.phone) && <p className="text-xs text-red-500 mt-1">{phoneError || fieldErrors.phone}</p>}
          </div>

          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Address Type</label>
            <div className="flex gap-3">
              {(["home", "work", "other"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type }))}
                  className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all ${
                    formData.type === type ? "bg-teal-600 text-white border-teal-600" : "bg-white border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => { setFormData(p => ({ ...p, addressLine1: e.target.value })); setFieldErrors(p => ({ ...p, addressLine1: undefined })); }}
              className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${fieldErrors.addressLine1 ? "border-red-400" : "border-gray-300"}`}
              placeholder="House/Flat No., Building Name"
            />
            {fieldErrors.addressLine1 && <p className="text-xs text-red-500 mt-1">{fieldErrors.addressLine1}</p>}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
            <input
              type="text"
              value={formData.addressLine2}
              onChange={(e) => setFormData(p => ({ ...p, addressLine2: e.target.value }))}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Street, Area, Landmark (optional)"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => { setFormData(p => ({ ...p, city: e.target.value })); setFieldErrors(p => ({ ...p, city: undefined })); }}
                className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${fieldErrors.city ? "border-red-400" : "border-gray-300"}`}
                placeholder="City"
              />
              {fieldErrors.city && <p className="text-xs text-red-500 mt-1">{fieldErrors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => { setFormData(p => ({ ...p, state: e.target.value })); setFieldErrors(p => ({ ...p, state: undefined })); }}
                className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${fieldErrors.state ? "border-red-400" : "border-gray-300"}`}
                placeholder="State"
              />
              {fieldErrors.state && <p className="text-xs text-red-500 mt-1">{fieldErrors.state}</p>}
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.pincode}
              onChange={(e) => { const val = e.target.value.replace(/\D/g, ""); setFormData(p => ({ ...p, pincode: val })); setFieldErrors(p => ({ ...p, pincode: undefined })); }}
              className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${fieldErrors.pincode ? "border-red-400" : "border-gray-300"}`}
              placeholder="6-digit pincode"
              maxLength={6}
            />
            {fieldErrors.pincode && <p className="text-xs text-red-500 mt-1">{fieldErrors.pincode}</p>}
          </div>

        </div>

        <div className="flex gap-3 px-6 py-5 border-t bg-gray-50">
          <button onClick={handleClose} className="flex-1 py-3.5 bg-gray-100 rounded-2xl font-medium">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`flex-1 py-3.5 rounded-2xl font-medium transition-colors ${saving ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"}`}
          >
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
});

AddAddressModal.displayName = "AddAddressModal";

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
    totalSellingPrice,
    discount,
    totalPayable,
    fittingFee,
    isModalOpen,
    editingAddressId,
    setEditingAddressId,
    handleSelectAddress,
    handleDeleteAddress,
    handleAddAddress,
    handleEditAddress,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleCopyCoupon,
    handleCouponInputChange,
    toggleCouponList,
    setPaymentMethod,
    handlePlaceOrder,
    setIsModalOpen,
  } = useCheckout();

  const editingAddress = addresses.find(a => a.id === editingAddressId) ?? null;
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const COD_MINIMUM = 2000;
  const isCodAllowed = totalPayable >= COD_MINIMUM;

  // Auto-deselect COD when total drops below minimum
  useEffect(() => {
    if (!isCodAllowed && paymentMethod === "COD") {
      setPaymentMethod("ONLINE");
    }
  }, [isCodAllowed, paymentMethod, setPaymentMethod]);

  const currentStep = "address";

  useEffect(() => {
    if (appliedCoupon && isCouponModalOpen) {
      setIsCouponModalOpen(false);
    }
  }, [appliedCoupon]);

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
                          <button onClick={(e) => { e.stopPropagation(); setEditingAddressId(address.id); }} className="text-gray-500 hover:text-gray-700 font-medium">Edit</button>
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
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{appliedCoupon}</p>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Applied</span>
                          </div>
                          <p className="text-green-600 text-sm font-medium">You saved ₹{couponSavings}</p>
                        </div>
                      </div>
                      <button onClick={handleRemoveCoupon} className="px-4 py-2 text-red-600 font-medium text-sm hover:bg-red-50 rounded-xl transition-colors">REMOVE</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsCouponModalOpen(true)}
                      className="flex items-center justify-between w-full text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">Apply Coupon</h3>
                          <p className="text-xs text-gray-500">Check available offers</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
                  <p className="font-semibold text-gray-900 mb-3">Payment Method</p>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 ${isCodAllowed ? "cursor-pointer" : "cursor-not-allowed"}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        disabled={!isCodAllowed}
                        onChange={() => setPaymentMethod("COD")}
                        className="w-4 h-4 text-teal-600 disabled:text-gray-300"
                      />
                      <span className={`text-sm ${isCodAllowed ? "text-gray-700" : "text-gray-400"}`}>Cash on Delivery</span>
                    </label>
                    {!isCodAllowed && (
                      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 ml-7">
                        Cash on Delivery is available only for orders above ₹{COD_MINIMUM.toLocaleString("en-IN")}. Please add more items or choose an online payment method.
                      </p>
                    )}
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
      <AddAddressModal
        isOpen={isModalOpen || editingAddressId !== null}
        isEditing={editingAddressId !== null}
        initialData={editingAddress ? {
          name: editingAddress.name,
          phone: editingAddress.phone,
          fullAddress: editingAddress.fullAddress,
          type: editingAddress.type,
        } : undefined}
        onClose={() => { setIsModalOpen(false); setEditingAddressId(null); }}
        onSave={async (data) => {
          if (editingAddressId) {
            await handleEditAddress(editingAddressId, data);
            setEditingAddressId(null);
          } else {
            await handleAddAddress(data);
            setIsModalOpen(false);
          }
        }}
      />
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        appliedCoupon={appliedCoupon}
        couponSavings={couponSavings}
        couponError={couponError}
        isApplyingCoupon={isApplyingCoupon}
        couponInput={couponInput}
        userCoupons={eligibleCoupons}
        usedCoupons={usedCoupons}
        copiedCoupon={copiedCoupon}
        cartTotal={totalSellingPrice}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onCouponInputChange={handleCouponInputChange}
        onCopyCoupon={handleCopyCoupon}
      />
    </div>
  );
});

CheckoutPage.displayName = "CheckoutPage";
