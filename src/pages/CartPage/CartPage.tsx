import { memo, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** Cart item interface */
interface CartItem {
  id: string;
  image: string;
  name: string;
  variant?: string;
  lensType?: string;
  lensPrice?: number;
  originalPrice: number;
  finalPrice: number;
  isFree?: boolean;
  hasGoldMembership?: boolean;
  canUploadPrescription?: boolean;
}

/** Sample cart items */
const CART_ITEMS: CartItem[] = [
  {
    id: "1",
    image: "/category/image.png",
    name: "Orange Black Full Rim Square Meller MEL S18811 Sunglasses",
    variant: "Meller Blue Tinted",
    lensPrice: 1600,
    originalPrice: 5000,
    finalPrice: 6600,
    canUploadPrescription: true,
  },
  {
    id: "2",
    image: "/category/image.png",
    name: "Lenskart Gold MAX Membership (2 Years)",
    variant: "Buy 1 Get 1 Free On Over 5000+ Items, Applicable Everywhere",
    originalPrice: 6000,
    finalPrice: 0,
    isFree: true,
  },
  {
    id: "3",
    image: "/category/image.png",
    name: "Matte Black Full Rim Square John Jacobs Rich Acetate JJ E13343 - C2 Eyeglasses-Sadie",
    lensType: "Circular Bi-Focal KT",
    lensPrice: 1500,
    originalPrice: 3900,
    finalPrice: 0,
    isFree: true,
    hasGoldMembership: true,
    canUploadPrescription: true,
  },
  {
    id: "4",
    image: "/category/image.png",
    name: "Matte Black Full Rim Square John Jacobs Rich Acetate JJ E13343 - C2 Eyeglasses-Sadie",
    originalPrice: 3900,
    finalPrice: 3900,
  },
];

/** Bill summary data */
const BILL_SUMMARY = {
  totalItemPrice: 21900,
  totalDiscount: 13740,
  fittingFee: 199,
  totalPayable: 8359,
};

export const CartPage = memo(function CartPage(): JSX.Element {
  const [cartItems, setCartItems] = useState<CartItem[]>(CART_ITEMS);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponSavings, setCouponSavings] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleApplyCoupon = useCallback(() => {
    if (!couponInput.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setIsApplyingCoupon(true);
    setCouponError("");

    setTimeout(() => {
      if (couponInput.toUpperCase() === "GET60") {
        setAppliedCoupon("GET60");
        setCouponSavings(2340);
        setCouponInput("");
      } else {
        setCouponError("Invalid coupon code");
      }
      setIsApplyingCoupon(false);
    }, 500);
  }, [couponInput]);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon("");
    setCouponSavings(0);
    setCouponError("");
  }, []);

  // Cart Items List - Responsive
  const cartItemsList = useMemo(() => (
    cartItems.map((item) => (
      <div 
        key={item.id} 
        className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 relative overflow-hidden"
      >
        {/* Free Badge */}
        {item.isFree && (
          <div className="absolute -left-2 top-6 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-r-full shadow-sm" 
               style={{ transform: "rotate(-45deg)", transformOrigin: "left top" }}>
            FREE
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Product Image */}
          <div className="w-full sm:w-40 h-40 sm:h-32 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain p-3"
              loading="lazy"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-base font-medium text-gray-900 leading-snug pr-2 line-clamp-2">
                {item.name}
              </h3>
              <div className="text-right shrink-0">
                <span className="text-gray-400 line-through text-sm">₹{item.originalPrice}</span>
              </div>
            </div>

            {/* Variant / Lens Info */}
            {item.variant && (
              <p className="text-gray-500 text-sm mt-1 mb-2 line-clamp-2">{item.variant}</p>
            )}

            {item.lensType && (
              <div className="flex justify-between items-center my-3">
                <span className="text-gray-600 text-sm">{item.lensType}</span>
                {item.lensPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">₹{item.lensPrice}</span>
                    {item.isFree && <span className="text-teal-600 font-semibold">Free</span>}
                  </div>
                )}
              </div>
            )}

            {item.canUploadPrescription && (
              <p className="text-teal-600 text-xs mb-4">You Can Upload Prescription After Payment</p>
            )}

            {/* Final Price */}
            <div className="flex justify-between items-center py-3 border-t border-gray-100">
              <span className="text-gray-700 font-medium">Final Price</span>
              <div className="text-right">
                {item.isFree ? (
                  <span className="text-teal-600 font-bold text-xl">Free</span>
                ) : (
                  <span className="font-bold text-gray-900 text-xl">₹{item.finalPrice}</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-5 text-sm pt-2">
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-600 font-medium hover:text-red-700 transition-colors"
              >
                Remove
              </button>
              <span className="text-gray-300">•</span>
              <button className="text-teal-700 font-medium hover:text-teal-800 transition-colors">
                {item.id === "2" ? "Know More" : "Repeat"}
              </button>
            </div>
          </div>
        </div>

        {/* Gold Membership Notice */}
        {item.hasGoldMembership && (
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>This Product is Free with Gold Membership!</span>
          </div>
        )}
      </div>
    ))
  ), [cartItems, handleRemoveItem]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-6 md:py-10">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* ====================== CART ITEMS ====================== */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 px-1">
                Cart ({cartItems.length} items)
              </h1>

              {cartItemsList}

              {cartItems.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                  Your cart is empty
                </div>
              )}
            </div>

            {/* ====================== BILL SUMMARY (Sticky on large screens) ====================== */}
            <div className="lg:w-96 lg:shrink-0">
              <div className="lg:sticky lg:top-[180px]">
                <h2 className="text-2xl font-semibold text-gray-900 mb-5 px-1">Bill Details</h2>

                {/* Bill Summary Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total item price</span>
                      <span>₹{BILL_SUMMARY.totalItemPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total discount</span>
                      <span className="text-green-600">-₹{BILL_SUMMARY.totalDiscount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fitting Fee</span>
                      <span>₹{BILL_SUMMARY.fittingFee}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Coupon ({appliedCoupon})</span>
                        <span className="text-green-600">-₹{couponSavings}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-semibold text-lg">Total payable</span>
                      <span className="font-bold text-2xl text-gray-900">
                        ₹{BILL_SUMMARY.totalPayable - couponSavings}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gold Membership Card */}
                <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-amber-900">Gold Max Membership added</h3>
                    <button className="text-amber-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-amber-800 text-sm font-medium mb-2">Add 2nd Pair for Free</p>
                  <p className="text-amber-700 text-xs leading-relaxed mb-5">
                    Buy 1 Get 1 Free applied + 10% cashback (will be sent after 14 days of order delivery)
                  </p>
                  <button className="text-amber-700 font-medium flex items-center gap-2 hover:text-amber-800 transition-colors">
                    Choose Now 
                    <span className="text-xl leading-none">→</span>
                  </button>
                </div>

                {/* Coupon Section */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{appliedCoupon} applied</p>
                        <p className="text-green-600 text-sm">You saved ₹{couponSavings}</p>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-red-600 font-medium text-sm hover:underline"
                      >
                        REMOVE
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-gray-900 mb-3">Apply Coupon</p>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code"
                          className="flex-1 px-5 py-3 border border-gray-300 rounded-2xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponInput.trim()}
                          className="px-7 py-3 bg-teal-700 text-white font-medium rounded-2xl hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {isApplyingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                      {couponError && <p className="text-red-500 text-sm mt-3">{couponError}</p>}
                    </div>
                  )}
                </div>

                {/* Insurance */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">Apply Insurance</p>
                      <p className="text-gray-500 text-sm">Tap to view your benefits</p>
                    </div>
                    <button className="w-9 h-9 rounded-2xl border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                      →
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="block w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-2xl text-center text-base transition-all active:scale-[0.985]"
                >
                  Proceed To Checkout →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

CartPage.displayName = "CartPage";