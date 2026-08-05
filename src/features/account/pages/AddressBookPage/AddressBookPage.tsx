import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { authApi } from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/hooks";
import type { AddressData, SaveAddressRequest } from "@/features/auth/types";

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
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((address: AddressData) => {
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
    setApiError("");
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
    if (!formData.name || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      setApiError("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      let res;
      if (editingAddress) {
        res = await authApi.updateAddress(editingAddress.id, formData);
      } else {
        res = await authApi.addAddress(formData);
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
  }, [editingAddress, formData]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData(EMPTY_ADDRESS);
    setApiError("");
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
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.isDefault}
                      onChange={() => handleFormChange("isDefault", !formData.isDefault)}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-teal-600 transition-colors duration-200" />
                    <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5" />
                  </label>
                  <span className="text-sm text-gray-700">Set as default address</span>
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
