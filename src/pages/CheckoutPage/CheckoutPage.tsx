import { memo, useMemo, useState, useCallback } from "react";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** Address interface */
interface Address {
  id: string;
  type: "HOME" | "OFFICE" | "OTHER";
  fullAddress: string;
  name: string;
  phone: string;
  deliveryDate: string;
  isSelected: boolean;
}

/** Checkout steps */
const CHECKOUT_STEPS = [
  { id: "login", label: "Login/Signup" },
  { id: "address", label: "Shipping Address" },
  { id: "payment", label: "Payment" },
  { id: "summary", label: "Summary" },
];

/** Sample addresses */
const SAMPLE_ADDRESSES: Address[] = [
  {
    id: "1",
    type: "HOME",
    fullAddress: "Edathuruthikaran Holdings, 10/450-2, Kundannoor, Maradu, Ernakulam, Kerala 682304",
    name: "Sbsj",
    phone: "9744727681",
    deliveryDate: "23 Feb",
    isSelected: true,
  },
];

/** Bill summary data */
const BILL_SUMMARY = {
  totalItemPrice: 35100,
  totalDiscount: 22140,
  fittingFee: 199,
  totalPayable: 13159,
  cashback: 1316,
};

/**
 * Add Address Modal Component
 */
const AddAddressModal = memo(function AddAddressModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<Address, "id" | "isSelected" | "deliveryDate">) => void;
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

  /** Handle input change */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  /** Handle type selection */
  const handleTypeSelect = useCallback((type: "HOME" | "OFFICE" | "OTHER") => {
    setFormData(prev => ({ ...prev, type }));
  }, []);

  /** Handle form submit */
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Address</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          {/* Address Type */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
            <div className="flex gap-3">
              {(["HOME", "OFFICE", "OTHER"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.type === type
                      ? "bg-teal-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter phone number"
              required
            />
          </div>

          {/* Full Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="House No., Building, Street, Area"
              rows={3}
              required
            />
          </div>

          {/* Pincode and City */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter pincode"
                maxLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter city"
                required
              />
            </div>
          </div>

          {/* State */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter state"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
});

AddAddressModal.displayName = "AddAddressModal";

/**
 * Checkout Page
 * Displays shipping address selection and bill summary
 */
export const CheckoutPage = memo(function CheckoutPage(): JSX.Element {
  const [addresses, setAddresses] = useState<Address[]>(SAMPLE_ADDRESSES);
  const [currentStep] = useState("address");
  const [isModalOpen, setIsModalOpen] = useState(false);

  /** Memoize header spacer style */
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  /** Handle address selection */
  const handleSelectAddress = useCallback((id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isSelected: addr.id === id
    })));
  }, []);

  /** Handle delete address */
  const handleDeleteAddress = useCallback((id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  }, []);

  /** Handle add address */
  const handleAddAddress = useCallback((addressData: Omit<Address, "id" | "isSelected" | "deliveryDate">) => {
    const newAddress: Address = {
      ...addressData,
      id: Date.now().toString(),
      isSelected: addresses.length === 0,
      deliveryDate: "25 Feb",
    };
    setAddresses(prev => [...prev, newAddress]);
  }, [addresses.length]);

  /** Open modal */
  const openModal = useCallback(() => setIsModalOpen(true), []);
  
  /** Close modal */
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  /** Memoize progress steps */
  const progressSteps = useMemo(() => (
    CHECKOUT_STEPS.map((step, index) => (
      <div key={step.id} className="flex items-center">
        <span className={`text-sm font-medium ${
          step.id === currentStep 
            ? "text-gray-900" 
            : "text-gray-400"
        }`}>
          {step.label}
        </span>
        {index < CHECKOUT_STEPS.length - 1 && (
          <svg className="w-4 h-4 mx-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    ))
  ), [currentStep]);

  /** Memoize address cards */
  const addressCards = useMemo(() => (
    addresses.map((address) => (
      <div 
        key={address.id} 
        className={`bg-sky-50 border-2 rounded-lg p-5 mb-4 cursor-pointer transition-colors ${
          address.isSelected ? "border-teal-600" : "border-sky-200 hover:border-sky-300"
        }`}
        onClick={() => handleSelectAddress(address.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              {address.type}
            </span>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            address.isSelected ? "border-teal-600 bg-teal-600" : "border-gray-300"
          }`}>
            {address.isSelected && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
        </div>

        <p className="text-gray-900 font-medium mb-2">{address.fullAddress}</p>
        <p className="text-gray-700 mb-3">{address.name}</p>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Muhammed Javad</span>
          <span className="text-gray-300">|</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{address.phone}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-gray-600 text-sm">Get it by {address.deliveryDate}</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAddress(address.id);
              }}
              className="text-gray-500 text-sm font-medium hover:text-gray-700 underline"
            >
              Delete
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="text-gray-500 text-sm font-medium hover:text-gray-700 underline"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    ))
  ), [addresses, handleSelectAddress, handleDeleteAddress]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      {/* Promotion Header */}
      <PromotionHeader />
      
      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1 py-6">
        <Container>
          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {progressSteps}
          </div>

          <div className="flex gap-8">
            {/* Left: Address Section */}
            <div className="flex-1">
              {/* Add Address Button */}
              <button
                onClick={openModal}
                className="flex items-center justify-center gap-2 w-full max-w-md mx-auto mb-6 px-6 py-3 bg-teal-700 text-white font-medium rounded-full hover:bg-teal-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add delivery Address
              </button>

              {/* Address Cards */}
              {addressCards}
            </div>

            {/* Right: Bill Details - Sticky */}
            <div className="w-[380px] shrink-0 self-start sticky" style={{ top: `${PROMOTION_HEADER_HEIGHT + 24}px` }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bill Details</h2>

              {/* Savings Banner */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 text-sm font-medium">
                  ₹{BILL_SUMMARY.totalDiscount} saved + ₹{BILL_SUMMARY.cashback} cashback on this order
                </span>
              </div>

              {/* Bill Summary Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
                <div className="flex justify-between items-center py-2">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                    Total item price
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <span className="text-gray-900">₹ {BILL_SUMMARY.totalItemPrice}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                    Total discount
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <span className="text-green-600">-₹ {BILL_SUMMARY.totalDiscount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Fitting Fee</span>
                  <span className="text-gray-900">₹ {BILL_SUMMARY.fittingFee}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-2">
                  <span className="text-gray-900 font-semibold">Total payable</span>
                  <span className="text-gray-900 font-bold text-lg">₹ {BILL_SUMMARY.totalPayable}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button className="w-full py-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors">
                Save Address & Proceed
              </button>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Add Address Modal */}
      <AddAddressModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleAddAddress}
      />
    </div>
  );
});

CheckoutPage.displayName = "CheckoutPage";
