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
  appliedCoupon: "",
  couponSavings: 0,
};

/**
 * Cart Page
 * Displays cart items and bill summary with checkout option.
 * Fully responsive: stacks to single column on mobile/tablet.
 */
export const CartPage = memo(function CartPage(): JSX.Element {
  const [cartItems, setCartItems] = useState<CartItem[]>(CART_ITEMS);
<<<<<<< HEAD
  const [showBill, setShowBill] = useState(false); // mobile bill toggle
=======
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponSavings, setCouponSavings] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
>>>>>>> ecdd40ce813f1fe7225e75df122230a08481fe92

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

<<<<<<< HEAD
=======
  /** Handle apply coupon */
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

  /** Handle remove coupon */
  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon("");
    setCouponSavings(0);
    setCouponError("");
  }, []);

  /** Memoize cart items list */
>>>>>>> ecdd40ce813f1fe7225e75df122230a08481fe92
  const cartItemsList = useMemo(() => (
    cartItems.map((item) => (
      <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mb-4 relative overflow-hidden">
        {/* Free Badge */}
        {item.isFree && (
          <span className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
            FREE
          </span>
        )}

        <div className="flex gap-3 sm:gap-6">
          {/* Product Image */}
          <div className="w-24 h-20 sm:w-40 sm:h-32 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain p-1 sm:p-2"
              loading="lazy"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1 sm:mb-2 gap-2">
              <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-snug line-clamp-3">
                {item.name}
              </h3>
              <span className="text-gray-400 line-through text-xs sm:text-sm shrink-0">
                ₹{item.originalPrice}
              </span>
            </div>

            {item.variant && (
              <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">
                {item.variant}
              </p>
            )}

            {item.lensType && (
              <div className="flex justify-between items-center mb-1 sm:mb-2 gap-2">
                <span className="text-gray-600 text-xs sm:text-sm truncate">{item.lensType}</span>
                {item.lensPrice && (
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <span className="text-gray-400 line-through text-xs sm:text-sm">₹{item.lensPrice}</span>
                    {item.isFree && (
                      <span className="text-teal-600 font-semibold text-xs sm:text-sm">Free</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {item.canUploadPrescription && (
              <p className="text-gray-500 text-[10px] sm:text-xs mb-2">
                You Can Upload Prescription After Payment
              </p>
            )}

            {/* Final Price */}
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-gray-700 font-medium text-xs sm:text-sm">Final Price</span>
              <div className="flex items-center gap-1 sm:gap-2">
                {item.finalPrice !== item.originalPrice + (item.lensPrice || 0) && (
                  <span className="text-gray-400 line-through text-xs sm:text-sm">
                    ₹{item.originalPrice + (item.lensPrice || 0)}
                  </span>
                )}
                {item.isFree ? (
                  <span className="text-teal-600 font-bold text-xs sm:text-sm">Free</span>
                ) : (
                  <span className="font-bold text-gray-900 text-xs sm:text-sm">₹{item.finalPrice}</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-teal-700 font-medium text-xs sm:text-sm underline"
              >
                Remove
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-teal-700 font-medium text-xs sm:text-sm underline">
                {item.id === "2" ? "Know More" : "Repeat"}
              </button>
            </div>
          </div>
        </div>

        {/* Gold Membership Notice */}
        {item.hasGoldMembership && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <svg className="w-4 h-4 text-teal-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>This Product is Free with Gold Membership!</span>
          </div>
        )}
      </div>
    ))
  ), [cartItems, handleRemoveItem]);

  /** Shared Bill Panel content */
  const billPanel = (
    <>
      {/* Bill Summary Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mb-4">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 text-sm">Total item price</span>
          <span className="text-gray-900 text-sm">₹{BILL_SUMMARY.totalItemPrice}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 text-sm">Total discount</span>
          <span className="text-green-600 text-sm">-₹{BILL_SUMMARY.totalDiscount}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 text-sm">Fitting Fee</span>
          <span className="text-gray-900 text-sm">₹{BILL_SUMMARY.fittingFee}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-2">
          <span className="text-gray-900 font-semibold text-sm">Total payable</span>
          <span className="text-gray-900 font-bold text-lg">₹{BILL_SUMMARY.totalPayable}</span>
        </div>
      </div>

      {/* Gold Membership Card */}
      <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 sm:p-5 mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-amber-900 text-sm">Gold Max Membership added</h3>
          <button className="text-amber-600 hover:text-amber-700 ml-2 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <p className="text-amber-800 text-sm font-medium mb-2">Add 2nd Pair for Free</p>
        <p className="text-amber-700 text-xs mb-4">
          Buy 1 Get 1 Free applied + 10% cashback (will be sent after 14 days of order delivery)
        </p>
        <div className="flex items-center justify-between">
          <span className="text-amber-800 font-medium text-sm">Choose Now</span>
          <button className="w-8 h-8 rounded-full border border-amber-400 bg-white flex items-center justify-center hover:bg-amber-100">
            <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Applied Coupon */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{BILL_SUMMARY.appliedCoupon} applied</p>
            <p className="text-gray-500 text-xs sm:text-sm">You are saving ₹{BILL_SUMMARY.couponSavings}</p>
          </div>
          <button className="text-gray-500 font-medium text-xs sm:text-sm hover:text-gray-700 ml-4 shrink-0">
            REMOVE
          </button>
        </div>
      </div>

      {/* Apply Insurance */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm">Apply Insurance</p>
            <p className="text-gray-500 text-xs sm:text-sm">Tap to view your benefits</p>
          </div>
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 ml-4 shrink-0">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="w-full py-4 bg-teal-700 text-white font-semibold rounded-full hover:bg-teal-800 transition-colors flex items-center justify-center gap-2 text-center text-sm sm:text-base"
        aria-label="Proceed to checkout"
      >
        Proceed To Checkout
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </>
  );

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-4 sm:py-6">
        <Container>
          {/* ── Desktop layout: side-by-side ── */}
          <div className="hidden lg:flex gap-8">
            {/* Left: Cart Items */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Cart ({cartItems.length} items)
              </h1>
              {cartItemsList}
            </div>

            {/* Right: Bill Details – sticky */}
            <div
              className="w-[380px] shrink-0 self-start sticky"
              style={{ top: `${PROMOTION_HEADER_HEIGHT + 24}px` }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bill Details</h2>
              {billPanel}
            </div>
          </div>

<<<<<<< HEAD
          {/* ── Mobile / Tablet layout: stacked ── */}
          <div className="lg:hidden">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Cart ({cartItems.length} items)
            </h1>
=======
              {/* Bill Summary Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total item price</span>
                  <span className="text-gray-900">₹{BILL_SUMMARY.totalItemPrice}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total discount</span>
                  <span className="text-green-600">-₹{BILL_SUMMARY.totalDiscount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Fitting Fee</span>
                  <span className="text-gray-900">₹{BILL_SUMMARY.fittingFee}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Coupon ({appliedCoupon})</span>
                    <span className="text-green-600">-₹{couponSavings}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-2">
                  <span className="text-gray-900 font-semibold">Total payable</span>
                  <span className="text-gray-900 font-bold text-lg">₹{BILL_SUMMARY.totalPayable - couponSavings}</span>
                </div>
              </div>
>>>>>>> ecdd40ce813f1fe7225e75df122230a08481fe92

            {cartItemsList}

<<<<<<< HEAD
            {/* Collapsible Bill Details */}
            <div className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                onClick={() => setShowBill((v) => !v)}
                aria-expanded={showBill}
              >
                <div>
                  <span className="font-semibold text-gray-900 text-sm">Bill Details</span>
                  <span className="ml-3 text-teal-700 font-bold text-sm">₹{BILL_SUMMARY.totalPayable}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showBill ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
=======
              {/* Coupon Card - Applied or Input */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{appliedCoupon} applied</p>
                      <p className="text-gray-500 text-sm">You are saving ₹{couponSavings}</p>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-red-500 font-medium text-sm hover:text-red-700">
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Apply Coupon</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isApplyingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                  </div>
                )}
              </div>
>>>>>>> ecdd40ce813f1fe7225e75df122230a08481fe92

              {showBill && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  {billPanel}
                </div>
              )}
            </div>

            {/* Always-visible checkout CTA on mobile */}
            {!showBill && (
              <Link
                to="/checkout"
                className="w-full py-4 bg-teal-700 text-white font-semibold rounded-full hover:bg-teal-800 transition-colors flex items-center justify-center gap-2 text-sm"
                aria-label="Proceed to checkout"
              >
                Proceed To Checkout · ₹{BILL_SUMMARY.totalPayable}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

CartPage.displayName = "CartPage";