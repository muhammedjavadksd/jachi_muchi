import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";
import { useNavigate } from "react-router-dom";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** Cart item interface matching localStorage structure */
interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  lens: string;
  lensPrice: number;
  totalPrice: number;
  powerType: string;
}

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

/** Order pricing breakdown */
interface OrderPricing {
  subtotal: number;
  discount: number;
  fittingFee: number;
  total: number;
}

/** Order structure */
interface OrderData {
  items: CartItem[];
  address: Address;
  pricing: OrderPricing;
  createdAt: string;
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
    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isSelected: true,
  },
];

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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">Add New Address</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Address Type */}
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

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="House No., Building, Street, Area"
              rows={3}
              required
            />
          </div>

          {/* Pincode, City, State */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Pincode"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="City"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="State"
                required
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition-colors text-base"
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
 * Checkout Page - Fully Responsive
 */
export const CheckoutPage = memo(function CheckoutPage(): JSX.Element {

  // Load cart from localStorage with safety fallback
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  // Correct pricing calculations
  const subtotal = useMemo(() =>
    cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart]);

  const discount = useMemo(() =>
    cart.reduce((sum, item) => sum + (item.productPrice + item.lensPrice - item.totalPrice), 0), [cart]);

  const fittingFee = 199;

  const totalPayable = useMemo(() =>
    subtotal + fittingFee, [subtotal]);

  const [addresses, setAddresses] = useState<Address[]>(SAMPLE_ADDRESSES);
  const [currentStep] = useState("address");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const handleSelectAddress = useCallback((id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isSelected: addr.id === id
    })));
  }, []);

  const handleDeleteAddress = useCallback((id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  }, []);

  const handleAddAddress = useCallback((addressData: Omit<Address, "id" | "isSelected" | "deliveryDate">) => {
    const newAddress: Address = {
      ...addressData,
      id: Date.now().toString(),
      isSelected: addresses.length === 0,
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setAddresses(prev => [...prev, newAddress]);
  }, [addresses.length]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const progressSteps = useMemo(() => (
    CHECKOUT_STEPS.map((step, index) => (
      <div key={step.id} className="flex items-center flex-1 min-w-0">
        <span className={`text-sm font-medium whitespace-nowrap ${step.id === currentStep ? "text-gray-900" : "text-gray-400"
          }`}>
          {step.label}
        </span>
        {index < CHECKOUT_STEPS.length - 1 && (
          <svg className="w-4 h-4 mx-2 sm:mx-3 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    ))
  ), [currentStep]);

  const addressCards = useMemo(() => (
    addresses.map((address) => (
      <div
        key={address.id}
        className={`bg-white border-2 rounded-2xl p-5 mb-4 cursor-pointer transition-all active:scale-[0.985] ${address.isSelected
          ? "border-teal-600 shadow-sm"
          : "border-gray-200 hover:border-gray-300"
          }`}
        onClick={() => handleSelectAddress(address.id)}
      >
        <div className="flex items-start justify-between mb-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            {address.type}
          </span>

          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${address.isSelected ? "border-teal-600 bg-teal-600" : "border-gray-300"
            }`}>
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
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address.id); }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Delete
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="text-gray-500 hover:text-gray-700 font-medium"
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
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-6 md:py-10">
        <Container>
          {/* Progress Steps - Responsive */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 px-1">
            {progressSteps}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* ====================== ADDRESS SECTION ====================== */}
            <div className="flex-1">
              <button
                onClick={openModal}
                className="flex items-center justify-center gap-3 w-full sm:w-auto mx-auto lg:mx-0 mb-8 px-8 py-4 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all active:scale-95 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New Delivery Address
              </button>

              {addressCards}

              {addresses.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No addresses added yet. Please add a delivery address.
                </div>
              )}
            </div>

            {/* ====================== BILL SUMMARY ====================== */}
            <div className="lg:w-96 lg:shrink-0">
              <div className="lg:sticky lg:top-[180px]">
                <h2 className="text-2xl font-semibold text-gray-900 mb-5 px-1">Bill Details</h2>

                {/* Savings Banner */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="text-green-700 font-medium">
                      ₹{discount} saved + ₹0 cashback
                    </span>
                  </div>
                </div>

                {/* Bill Summary Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total item price</span>
                      <span className="font-medium">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total discount</span>
                      <span className="text-green-600 font-medium">-₹{discount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fitting Fee</span>
                      <span>₹{fittingFee}</span>
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-semibold text-lg">Total payable</span>
                      <span className="font-bold text-2xl text-gray-900">
                        ₹{totalPayable}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={async () => {
                    const selectedAddress = addresses.find(a => a.isSelected);

                    if (!selectedAddress) {
                      alert("Please select address");
                      return;
                    }

                    if (cart.length === 0) {
                      alert("Your cart is empty");
                      return;
                    }

                    try {
                      const res = await fetch("http://localhost:5000/api/orders", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                          items: cart.map(item => ({
                            productId: item.productId,
                            name: item.productName,
                            price: item.totalPrice,
                            quantity: 1
                          })),
                          addressId: selectedAddress.id,
                          totalAmount: totalPayable
                        })
                      });

                      const data = await res.json();

                      if (!data.success) {
                        throw new Error("Order failed");
                      }

                      // Clear cart AFTER success
                      localStorage.removeItem("cart");

                      navigate("/order-success");

                    } catch (error) {
                      console.error(error);
                      alert("Failed to place order");
                    }
                  }}

                  className="mt-6 w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-2xl text-base transition-all active:scale-[0.985]"
                >
                  Save Address & Proceed
                </button>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />

      <AddAddressModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleAddAddress}
      />
    </div>
  );
});

CheckoutPage.displayName = "CheckoutPage";
