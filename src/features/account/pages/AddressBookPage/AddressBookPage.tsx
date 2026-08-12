import { memo, useMemo, useState, useCallback, useEffect, useRef } from "react";
import { authApi } from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/hooks";
import type { AddressData, SaveAddressRequest } from "@/features/auth/types";

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

function getPhoneError(phone: string, country: CountryEntry | null): string {
  if (!phone) return "";
  if (!country) return "Please select a country code.";
  const { digits, name } = country;
  if (typeof digits === "number") {
    if (phone.length !== digits)
      return `${name} numbers are ${digits} digits. You entered ${phone.length}.`;
  } else {
    const [min, max] = digits;
    if (phone.length < min || phone.length > max)
      return `${name} numbers are ${min}–${max} digits. You entered ${phone.length}.`;
  }
  return "";
}

interface FieldErrors {
  name?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

const EMPTY_ERRORS: FieldErrors = {};

/** Empty address template */
const EMPTY_ADDRESS: SaveAddressRequest = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  type: "home",
  isDefault: false,
};

export const AddressBookPage = memo(function AddressBookPage(): JSX.Element {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);
  const [formData, setFormData] = useState<SaveAddressRequest>(EMPTY_ADDRESS);
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; name: string }>({ open: false, id: null, name: "" });
  const [selectedCountry, setSelectedCountry] = useState<CountryEntry>(DEFAULT_COUNTRY);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(EMPTY_ERRORS);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const validateForm = useCallback((data: SaveAddressRequest, country: CountryEntry): FieldErrors => {
    const errs: FieldErrors = {};
    const name = data.name.trim();
    if (!name) errs.name = "Full name is required.";
    else if (name.length < 2) errs.name = "Name must be at least 2 characters.";
    else if (name.length > 50) errs.name = "Name must be 50 characters or fewer.";
    if (!data.phone) errs.phone = "Phone number is required.";
    else { const pErr = getPhoneError(data.phone, country); if (pErr) errs.phone = pErr; }
    if (!data.addressLine1.trim()) errs.addressLine1 = "Address line 1 is required.";
    if (!data.city.trim()) errs.city = "City is required.";
    if (!data.state.trim()) errs.state = "State is required.";
    const pin = data.pincode.trim();
    if (!pin) errs.pincode = "Pincode is required.";
    else if (!/^\d{6}$/.test(pin)) errs.pincode = "Pincode must be exactly 6 digits.";
    return errs;
  }, []);

  useEffect(() => {
    if (!showCountryDropdown) return;
    const handler = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCountryDropdown]);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  useEffect(() => {
    if (!user?.id) return;
    fetchAddresses();
  }, [user?.id]);

  const fetchAddresses = async () => {
    try {
      const res = await authApi.getAddresses();
      if (res.success && res.data) {
        setAddresses(res.data.map(addr => ({ ...addr, id: (addr as any)._id || addr.id })));
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = useCallback(() => {
    setEditingAddress(null);
    setFormData(EMPTY_ADDRESS);
    setApiError("");
    setSelectedCountry(DEFAULT_COUNTRY);
    setCountrySearch("");
    setPhoneError("");
    setFieldErrors(EMPTY_ERRORS);
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((address: AddressData) => {
    setEditingAddress(address);
    // parse stored phone — strip country code prefix if present
    const storedPhone = address.phone || "";
    const matched = COUNTRIES.find((c) => storedPhone.startsWith(c.code));
    const country = matched ?? DEFAULT_COUNTRY;
    const numberPart = matched ? storedPhone.slice(matched.code.length) : storedPhone;
    setSelectedCountry(country);
    setFormData({
      name: address.name,
      phone: numberPart,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      type: address.type,
      isDefault: address.isDefault,
    });
    setPhoneError("");
    setCountrySearch("");
    setApiError("");
    setFieldErrors(EMPTY_ERRORS);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!deleteModal.open) {
      setDeleteModal({ open: true, id, name });
      return;
    }
    try {
      const res = await authApi.deleteAddress(id);
      if (res.success) {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
      }
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (error) {
      console.error("Failed to delete address:", error);
      setDeleteModal({ open: false, id: null, name: "" });
    }
  }, [deleteModal.open]);

  const handleSetDefault = useCallback(async (id: string) => {
    try {
      const res = await authApi.setDefaultAddress(id);
      if (res.success) {
        fetchAddresses();
      }
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  }, []);

  const handleFormChange = useCallback((field: keyof SaveAddressRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setApiError("");
    const errs = validateForm(formData, selectedCountry);
    setFieldErrors(errs);
    if (errs.phone) setPhoneError(errs.phone);
    if (Object.keys(errs).length > 0) return;
    const fullPhone = `${selectedCountry.code}${formData.phone}`;
    setSaving(true);
    try {
      let res;
      if (editingAddress) {
        res = await authApi.updateAddress(editingAddress.id, { ...formData, phone: fullPhone });
      } else {
        res = await authApi.addAddress({ ...formData, phone: fullPhone });
      }
      if (res.success) {
        fetchAddresses();
        handleCloseModal();
      } else {
        setApiError(res.message || "Failed to save address");
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }, [editingAddress, formData, selectedCountry, validateForm]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData(EMPTY_ADDRESS);
    setApiError("");
    setSelectedCountry(DEFAULT_COUNTRY);
    setCountrySearch("");
    setPhoneError("");
    setFieldErrors(EMPTY_ERRORS);
  }, []);

  // Sidebar now rendered by <AccountSidebar />

  // Address Cards
  const addressCards = useMemo(() => (
    addresses.map((address) => (
      <div 
        key={address.id}
        className={`relative p-6 bg-white border-2 rounded-2xl transition-all hover:shadow-md ${
          address.isDefault ? "border-teal-500" : "border-gray-200"
        }`}
      >
        {address.isDefault && (
          <span className="absolute top-4 right-4 px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-xl">
            DEFAULT
          </span>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-xl ${
            address.type === "home" ? "bg-blue-100 text-blue-700" :
            address.type === "work" ? "bg-purple-100 text-purple-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {address.type.toUpperCase()}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1">{address.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{address.phone}</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
          <br />
          {address.city}, {address.state} - {address.pincode}
        </p>

        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => handleEdit(address)}
            className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => handleDelete(address.id, address.name)}
            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          {!address.isDefault && (
            <button
              onClick={() => handleSetDefault(address.id)}
              className="text-sm font-medium text-gray-600 hover:text-gray-700 flex items-center gap-1.5 ml-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Set as Default
            </button>
          )}
        </div>
      </div>
    ))
  ), [addresses, handleEdit, handleDelete, handleSetDefault]);

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Address Book</h1>
        <p className="text-gray-500 mt-1">Manage your saved addresses for faster checkout</p>
      </div>

      {/* Add New Address Button */}
      <button
        onClick={handleAddNew}
        className="w-full md:w-auto mb-6 px-6 py-3.5 bg-teal-600 text-white font-medium rounded-2xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Address
      </button>

      {/* Address Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {[1, 2].map(i => (
            <div key={i} className="p-6 bg-white border-2 border-gray-200 rounded-2xl animate-pulse">
              <div className="h-5 bg-gray-200 rounded-xl w-1/4 mb-4" />
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="h-5 bg-gray-100 rounded w-16" />
                <div className="h-5 bg-gray-100 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {addressCards}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Addresses Saved</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Add your first address to make checkout faster and easier.
          </p>
          <button
            onClick={handleAddNew}
            className="px-8 py-3.5 bg-teal-600 text-white font-medium rounded-2xl hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Address
          </button>
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[100]" onClick={handleCloseModal} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4 z-[101]">
            <div className="bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button onClick={handleCloseModal} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                {apiError && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{apiError}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => { handleFormChange("name", e.target.value); setFieldErrors(p => ({ ...p, name: undefined })); }}
                    className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${fieldErrors.name ? "border-red-400" : "border-gray-300"}`}
                    placeholder="Enter full name"
                  />
                  {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <div className="flex gap-2">
                    <div className="relative shrink-0" ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => { setShowCountryDropdown((p) => !p); setCountrySearch(""); }}
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
                                onClick={() => { setSelectedCountry(c); setShowCountryDropdown(false); setPhoneError(getPhoneError(formData.phone, c)); }}
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
                        handleFormChange("phone", val);
                        const pErr = getPhoneError(val, selectedCountry);
                        setPhoneError(pErr);
                        setFieldErrors(p => ({ ...p, phone: undefined }));
                      }}
                      className={`flex-1 px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        phoneError || fieldErrors.phone ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="Phone number"
                    />
                  </div>
                  {(phoneError || fieldErrors.phone) && <p className="text-xs text-red-500 mt-1">{phoneError || fieldErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Address Type</label>
                  <div className="flex gap-3">
                    {(["home", "work", "other"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFormChange("type", type)}
                        className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all ${
                          formData.type === type
                            ? "bg-teal-600 text-white border-teal-600"
                            : "bg-white border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => { handleFormChange("addressLine1", e.target.value); setFieldErrors(p => ({ ...p, addressLine1: undefined })); }}
                    className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${fieldErrors.addressLine1 ? "border-red-400" : "border-gray-300"}`}
                    placeholder="House/Flat No., Building Name"
                  />
                  {fieldErrors.addressLine1 && <p className="text-xs text-red-500 mt-1">{fieldErrors.addressLine1}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => handleFormChange("addressLine2", e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Street, Area, Landmark (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => { handleFormChange("city", e.target.value); setFieldErrors(p => ({ ...p, city: undefined })); }}
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
                      onChange={(e) => { handleFormChange("state", e.target.value); setFieldErrors(p => ({ ...p, state: undefined })); }}
                      className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${fieldErrors.state ? "border-red-400" : "border-gray-300"}`}
                      placeholder="State"
                    />
                    {fieldErrors.state && <p className="text-xs text-red-500 mt-1">{fieldErrors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      handleFormChange("pincode", val);
                      setFieldErrors(p => ({ ...p, pincode: undefined }));
                    }}
                    className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${fieldErrors.pincode ? "border-red-400" : "border-gray-300"}`}
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  {fieldErrors.pincode && <p className="text-xs text-red-500 mt-1">{fieldErrors.pincode}</p>}
                </div>


              </div>

              <div className="flex gap-3 px-6 py-5 border-t bg-gray-50">
                <button onClick={handleCloseModal} className="flex-1 py-3.5 bg-gray-100 rounded-2xl font-medium">Cancel</button>
                <button onClick={handleSave} disabled={saving} className={`flex-1 py-3.5 rounded-2xl font-medium transition-colors ${saving ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
                  {saving ? "Saving..." : editingAddress ? "Save Changes" : "Add Address"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[100]" onClick={() => setDeleteModal({ open: false, id: null, name: "" })} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 z-[101]">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Address</h3>
                <p className="text-gray-500 mb-1">Are you sure you want to delete this address?</p>
                {deleteModal.name && (
                  <p className="text-sm font-medium text-gray-700 bg-gray-50 px-4 py-2 rounded-xl mb-4">
                    {deleteModal.name}
                  </p>
                )}
                <p className="text-sm text-red-500 mb-6">This action cannot be undone</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteModal({ open: false, id: null, name: "" })} 
                  className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteModal.id && handleDelete(deleteModal.id, deleteModal.name)} 
                  className="flex-1 py-3.5 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});

AddressBookPage.displayName = "AddressBookPage";
