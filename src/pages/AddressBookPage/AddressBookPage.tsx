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

export const AddressBookPage = memo(function AddressBookPage(): JSX.Element {
  const [activeMenu] = useState("address");
  const [addresses, setAddresses] = useState<Address[]>(SAMPLE_ADDRESSES);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, "id">>(EMPTY_ADDRESS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  const handleAddNew = useCallback(() => {
    setEditingAddress(null);
    setFormData(EMPTY_ADDRESS);
    setShowModal(true);
  }, []);

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

  const handleDelete = useCallback((id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  }, []);

  const handleSetDefault = useCallback((id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  }, []);

  const handleFormChange = useCallback((field: keyof Omit<Address, "id">, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    if (editingAddress) {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id 
          ? { ...formData, id: editingAddress.id }
          : formData.isDefault ? { ...addr, isDefault: false } : addr
      ));
    } else {
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

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData(EMPTY_ADDRESS);
  }, []);

  // Desktop Sidebar
  const desktopSidebar = useMemo(() => (
    SIDEBAR_MENU.map((item) => (
      <Link
        key={item.id}
        to={item.link}
        className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors flex items-center justify-between border-b border-gray-200 last:border-b-0 ${
          activeMenu === item.id ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-100"
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

  // Mobile Account Menu (First on mobile)
  const mobileAccountMenu = useMemo(() => (
    <div className="md:hidden mb-6">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full px-5 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors border-b border-gray-200"
        >
          <span className="font-medium text-gray-900">Account Menu</span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isMobileMenuOpen && (
          <div className="divide-y divide-gray-100">
            {SIDEBAR_MENU.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className={`block px-5 py-4 text-sm font-medium transition-colors ${
                  activeMenu === item.id ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.icon === "3d" && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  ), [activeMenu, isMobileMenuOpen]);

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
            onClick={() => handleDelete(address.id)}
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
    <div className="w-full min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-6 md:py-8">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Address Book</h1>
              <p className="text-gray-500 mt-1">Manage your saved addresses for faster checkout</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Desktop Sidebar */}
              <div className="hidden md:block w-64 shrink-0">
                <div
                  className="sticky bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden"
                  style={{ top: `${PROMOTION_HEADER_HEIGHT + 32}px` }}
                >
                  <nav>{desktopSidebar}</nav>
                </div>
              </div>

              {/* Mobile Account Menu - FIRST on mobile */}
              {mobileAccountMenu}

              {/* Main Content */}
              <div className="flex-1">
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
                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    {addressCards}
                  </div>
                ) : (
                  /* Empty State */
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
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />

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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => handleFormChange("addressLine1", e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="House/Flat No., Building Name"
                  />
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
                      onChange={(e) => handleFormChange("city", e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleFormChange("state", e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleFormChange("pincode", e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
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

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleFormChange("isDefault", !formData.isDefault)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.isDefault ? "bg-teal-600" : "bg-gray-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.isDefault ? "translate-x-6" : ""}`} />
                  </button>
                  <span className="text-sm text-gray-700">Set as default address</span>
                </div>
              </div>

              <div className="flex gap-3 px-6 py-5 border-t bg-gray-50">
                <button onClick={handleCloseModal} className="flex-1 py-3.5 bg-gray-100 rounded-2xl font-medium">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3.5 bg-teal-600 text-white rounded-2xl font-medium">
                  {editingAddress ? "Save Changes" : "Add Address"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

AddressBookPage.displayName = "AddressBookPage";