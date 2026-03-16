import { memo, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** Sidebar menu items */
const SIDEBAR_MENU = [
  { id: "orders", label: "MY ORDERS", icon: null, link: "/account" },
  { id: "3d-model", label: "MY 3D MODEL", icon: "3d", link: "/account/3d-model" },
  { id: "account-info", label: "ACCOUNT INFORMATION", icon: null, link: "/account/info" },
  { id: "notifications", label: "MANAGE NOTIFICATIONS", icon: null, link: "/account/notifications" },
  { id: "address", label: "ADDRESS BOOK", icon: null, link: "/account/address" },
  { id: "prescriptions", label: "MY PRESCRIPTIONS", icon: null, link: "/account/prescriptions" },
];

/** Address interface */
interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
}

/** Sample addresses */
const SAMPLE_ADDRESSES: Address[] = [
  {
    id: "1",
    name: "Muhammed Javad",
    phone: "+91 9876543210",
    addressLine1: "Edathuruthikaran Holdings",
    addressLine2: "Kundannoor Junction",
    city: "Maradu",
    state: "Kerala",
    pincode: "682304",
    type: "home",
    isDefault: true,
  },
  {
    id: "2",
    name: "Muhammed Javad",
    phone: "+91 9876543210",
    addressLine1: "TechPark Building, 4th Floor",
    addressLine2: "Infopark SEZ",
    city: "Kochi",
    state: "Kerala",
    pincode: "682042",
    type: "work",
    isDefault: false,
  },
];

/** Empty address template */
const EMPTY_ADDRESS: Omit<Address, "id"> = {
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

/**
 * Address Book Page
 * Allows users to manage their saved addresses
 */
export const AddressBookPage = memo(function AddressBookPage(): JSX.Element {
  const [activeMenu] = useState("address");
  const [addresses, setAddresses] = useState<Address[]>(SAMPLE_ADDRESSES);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, "id">>(EMPTY_ADDRESS);

  /** Memoize header spacer style */
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  /** Open add modal */
  const handleAddNew = useCallback(() => {
    setEditingAddress(null);
    setFormData(EMPTY_ADDRESS);
    setShowModal(true);
  }, []);

  /** Open edit modal */
  const handleEdit = useCallback((address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      type: address.type,
      isDefault: address.isDefault,
    });
    setShowModal(true);
  }, []);

  /** Handle delete */
  const handleDelete = useCallback((id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  }, []);

  /** Handle set default */
  const handleSetDefault = useCallback((id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  }, []);

  /** Handle form change */
  const handleFormChange = useCallback((field: keyof Omit<Address, "id">, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  /** Handle save */
  const handleSave = useCallback(() => {
    if (editingAddress) {
      // Update existing
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id 
          ? { ...formData, id: editingAddress.id }
          : formData.isDefault ? { ...addr, isDefault: false } : addr
      ));
    } else {
      // Add new
      const newAddress: Address = {
        ...formData,
        id: Date.now().toString(),
      };
      setAddresses(prev => {
        if (formData.isDefault) {
          return [...prev.map(addr => ({ ...addr, isDefault: false })), newAddress];
        }
        return [...prev, newAddress];
      });
    }
    setShowModal(false);
    setEditingAddress(null);
    setFormData(EMPTY_ADDRESS);
  }, [editingAddress, formData]);

  /** Close modal */
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData(EMPTY_ADDRESS);
  }, []);

  /** Memoize sidebar menu */
  const sidebarMenu = useMemo(() => (
    SIDEBAR_MENU.map((item) => (
      <Link
        key={item.id}
        to={item.link}
        className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors flex items-center justify-between border-b border-gray-200 last:border-b-0 ${
          activeMenu === item.id
            ? "bg-teal-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span>{item.label}</span>
        {item.icon === "3d" && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        )}
      </Link>
    ))
  ), [activeMenu]);

  /** Memoize address cards */
  const addressCards = useMemo(() => (
    addresses.map((address) => (
      <div 
        key={address.id}
        className={`relative p-5 bg-white border-2 rounded-xl transition-shadow hover:shadow-md ${
          address.isDefault ? "border-teal-500" : "border-gray-200"
        }`}
      >
        {/* Default Badge */}
        {address.isDefault && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded">
            DEFAULT
          </span>
        )}

        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            address.type === "home" ? "bg-blue-100 text-blue-700" :
            address.type === "work" ? "bg-purple-100 text-purple-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {address.type.toUpperCase()}
          </span>
        </div>

        {/* Address Details */}
        <h3 className="font-semibold text-gray-900 mb-1">{address.name}</h3>
        <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
        <p className="text-sm text-gray-600">
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </p>
        <p className="text-sm text-gray-600">
          {address.city}, {address.state} - {address.pincode}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => handleEdit(address)}
            className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => handleDelete(address.id)}
            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          {!address.isDefault && (
            <button
              onClick={() => handleSetDefault(address.id)}
              className="text-sm font-medium text-gray-600 hover:text-gray-700 flex items-center gap-1 ml-auto"
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
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Promotion Header */}
      <PromotionHeader />
      
      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1 py-6">
        <Container>
          <div className="flex gap-8">
            {/* Left Sidebar - Sticky */}
            <div 
              className="w-64 shrink-0 sticky"
              style={{ top: `${PROMOTION_HEADER_HEIGHT + 24}px` }}
            >
              <nav className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                {sidebarMenu}
              </nav>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Address Book</h1>
                  <p className="text-gray-500 mt-1">Manage your saved addresses for faster checkout</p>
                </div>
                <button
                  onClick={handleAddNew}
                  className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Address
                </button>
              </div>

              {/* Address Cards */}
              {addresses.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {addressCards}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16 px-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Addresses Saved</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Add your first address to make checkout faster and easier.
                  </p>
                  <button
                    onClick={handleAddNew}
                    className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Add/Edit Address Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={handleCloseModal}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-[101] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleFormChange("addressLine1", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="House/Flat No., Building Name"
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleFormChange("addressLine2", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Street, Area, Landmark"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleFormChange("state", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="State"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleFormChange("pincode", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </div>

              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <div className="flex gap-3">
                  {(["home", "work", "other"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFormChange("type", type)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        formData.type === type
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Set as Default */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleFormChange("isDefault", !formData.isDefault)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.isDefault ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      formData.isDefault ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">Set as default address</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                {editingAddress ? "Save Changes" : "Add Address"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

AddressBookPage.displayName = "AddressBookPage";
