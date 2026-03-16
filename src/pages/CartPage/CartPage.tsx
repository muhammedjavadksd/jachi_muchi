import { memo, useMemo, useState, useCallback } from "react";
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
  appliedCoupon: "GET60",
  couponSavings: 2340,
};

/**
 * Cart Page
 * Displays cart items and bill summary with checkout option
 */
export const CartPage = memo(function CartPage(): JSX.Element {
  const [cartItems, setCartItems] = useState<CartItem[]>(CART_ITEMS);

  /** Memoize header spacer style */
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  /** Handle remove item */
  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  /** Memoize cart items list */
  const cartItemsList = useMemo(() => (
    cartItems.map((item) => (
      <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-5 mb-4 relative">
        {/* Free Badge */}
        {item.isFree && (
          <div className="absolute -left-2 top-8 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-r-full" style={{ transform: "rotate(-45deg)", transformOrigin: "left top" }}>
            FREE
          </div>
        )}
        
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="w-40 h-32 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain p-2"
              loading="lazy"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-900 pr-4 leading-snug">
                {item.name}
              </h3>
              <div className="text-right shrink-0">
                <span className="text-gray-400 line-through text-sm">₹{item.originalPrice}</span>
              </div>
            </div>

            {/* Variant / Lens Info */}
            {item.variant && (
              <p className="text-gray-500 text-sm mb-2">{item.variant}</p>
            )}

            {/* Lens Type */}
            {item.lensType && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">{item.lensType}</span>
                {item.lensPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">₹{item.lensPrice}</span>
                    {item.isFree && <span className="text-teal-600 font-semibold text-sm">Free</span>}
                  </div>
                )}
              </div>
            )}

            {/* Upload Prescription Note */}
            {item.canUploadPrescription && (
              <p className="text-gray-500 text-xs mb-3">You Can Upload Prescription After Payment</p>
            )}

            {/* Final Price */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 font-medium">Final Price</span>
              <div className="flex items-center gap-2">
                {item.finalPrice !== item.originalPrice + (item.lensPrice || 0) && (
                  <span className="text-gray-400 line-through text-sm">₹{item.originalPrice + (item.lensPrice || 0)}</span>
                )}
                {item.isFree ? (
                  <span className="text-teal-600 font-bold">Free</span>
                ) : (
                  <span className="font-bold text-gray-900">₹{item.finalPrice}</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-teal-700 font-medium text-sm underline"
              >
                Remove
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-teal-700 font-medium text-sm underline">
                {item.id === "2" ? "Know More" : "Repeat"}
              </button>
            </div>
          </div>
        </div>

        {/* Gold Membership Notice */}
        {item.hasGoldMembership && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
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
      {/* Promotion Header */}
      <PromotionHeader />
      
      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1 py-6">
        <Container>
          <div className="flex gap-8">
            {/* Left: Cart Items */}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Cart ({cartItems.length} items)
              </h1>

              {/* Cart Items List */}
              {cartItemsList}
            </div>

            {/* Right: Bill Details - Sticky */}
            <div className="w-[380px] shrink-0 self-start sticky" style={{ top: `${PROMOTION_HEADER_HEIGHT + 24}px` }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bill Details</h2>

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
                <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-2">
                  <span className="text-gray-900 font-semibold">Total payable</span>
                  <span className="text-gray-900 font-bold text-lg">₹{BILL_SUMMARY.totalPayable}</span>
                </div>
              </div>

              {/* Gold Membership Card */}
              <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-5 mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-amber-900">Gold Max Membership added</h3>
                  <button className="text-amber-600 hover:text-amber-700">
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

              {/* Applied Coupon Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{BILL_SUMMARY.appliedCoupon} applied</p>
                    <p className="text-gray-500 text-sm">You are saving ₹{BILL_SUMMARY.couponSavings}</p>
                  </div>
                  <button className="text-gray-500 font-medium text-sm hover:text-gray-700">
                    REMOVE
                  </button>
                </div>
              </div>

              {/* Apply Insurance Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Apply Insurance</p>
                    <p className="text-gray-500 text-sm">Tap to view your benefits</p>
                  </div>
                  <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full py-4 bg-teal-700 text-white font-semibold rounded-full hover:bg-teal-800 transition-colors flex items-center justify-center gap-2">
                Proceed To Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
});

CartPage.displayName = "CartPage";
