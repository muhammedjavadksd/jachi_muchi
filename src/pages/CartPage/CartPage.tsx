import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** Cart item interface matching localStorage structure */
interface CartItem {
  cartItemId?: string;
  productId: string;
  productName: string;
  productPrice: number;
  mrp?: number;
  quantity?: number;
  color: { name: string; id: string } | null;
  lens: {
    id?: string;
    name: string;
    price: number;
  } | null;
  lensPrice?: number;
  totalPrice: number;
  powerType?: string;
}

/** Coupon data interface */
interface CouponData {
  code: string;
  savings: number;
}

export const CartPage = memo(function CartPage(): JSX.Element {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponSavings, setCouponSavings] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Load cart and coupon from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(stored);

    const savedCoupon = JSON.parse(localStorage.getItem("coupon") || "null");
    if (savedCoupon && savedCoupon.code && savedCoupon.savings) {
      setAppliedCoupon(savedCoupon.code);
      setCouponSavings(savedCoupon.savings);
    }
  }, []);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const handleRemoveItem = useCallback((cartItemIdToRemove: string) => {
    setCartItems(prev => {
      // Filter by cartItemId instead of productId
      const updated = prev.filter(item => item.cartItemId !== cartItemIdToRemove);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
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
        const couponData: CouponData = { code: "GET60", savings: 2340 };
        setAppliedCoupon(couponData.code);
        setCouponSavings(couponData.savings);
        setCouponInput("");
        localStorage.setItem("coupon", JSON.stringify(couponData));
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
    localStorage.removeItem("coupon");
  }, []);

  // Total MRP (Original Price of everything)
  const totalItemPrice = useMemo(() =>
    cartItems.reduce((sum, item) => sum + ((item.mrp || item.productPrice) * (item.quantity || 1)) + (item.lens?.price || 0), 0),
    [cartItems]);

  // Total Selling Price (What they actually pay for the items)
  const totalSellingPrice = useMemo(() =>
    cartItems.reduce((sum, item) => sum + (item.productPrice * (item.quantity || 1)) + (item.lens?.price || 0), 0),
    [cartItems]);

  // Total Discount (Difference between MRP and Selling Price)
  const totalDiscount = useMemo(() => totalItemPrice - totalSellingPrice, [totalItemPrice, totalSellingPrice]);

  const fittingFee = 199;

 const totalPayable = useMemo(() =>
    totalSellingPrice + fittingFee - couponSavings, [totalSellingPrice, couponSavings]);
 
  const cartItemsList = useMemo(() => (
    cartItems.map((item, index) => (
      <div
        key={item.cartItemId || `${item.productId}-${index}`}
        className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Product Image */}
          <div className="w-full sm:w-40 h-40 sm:h-32 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
            <img
              src="/category/image.png"
              alt={item.productName}
              className="w-full h-full object-contain p-3"
              loading="lazy"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-base font-medium text-gray-900 leading-snug pr-2 line-clamp-2">
                {item.productName}
              </h3>
              <div className="text-right shrink-0">
                {item.mrp && item.mrp > item.productPrice && (
                  <span className="text-gray-400 line-through text-sm">₹{item.mrp}</span>
                )}                </div>
            </div>

            {/* Color Info */}
            {item.color && (
              <div className="flex items-center gap-2 mt-2">
                <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: item.color.name }} />
                <span className="text-gray-600 text-sm">Color: {item.color.name}</span>
              </div>
            )}

            {/* Lens Info */}
            {item.lens && (
              <div className="flex justify-between items-center my-3">
                <span className="text-gray-600 text-sm">Lens: {item.lens.name}{item.lens.price > 0 ? ` (+₹${item.lens.price})` : ''}</span>
              </div>
            )}

            {/* Final Price */}
            <div className="flex justify-between items-center py-3 border-t border-gray-100">
              <span className="text-gray-700 font-medium">Final Price</span>
              <div className="text-right">
                <span className="font-bold text-gray-900 text-xl">₹{item.productPrice + (item.lens?.price || 0)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-5 text-sm pt-2">
              <button
                onClick={() => handleRemoveItem(item.cartItemId!)} className="text-red-600 font-medium hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
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
                      <span>₹{totalItemPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total discount</span>
                      <span className="text-green-600">-₹{totalDiscount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fitting Fee</span>
                      <span>₹{fittingFee}</span>
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
                        ₹{totalPayable}
                      </span>
                    </div>
                  </div>
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
