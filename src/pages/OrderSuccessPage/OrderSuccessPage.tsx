import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** Order item interface */
interface OrderItem {
  id: string;
  image: string;
  name: string;
  quantity: number;
  price: number;
}

/** Sample order data */
const ORDER_DATA = {
  orderId: "LK2026021412345",
  orderDate: "14 Feb 2026",
  estimatedDelivery: "23 Feb 2026",
  paymentMethod: "Credit Card",
  items: [
    {
      id: "1",
      image: "/category/image.png",
      name: "Lenskart Air Hustlr Full Rim Rectangle Eyeglasses",
      quantity: 1,
      price: 3100,
    },
    {
      id: "2",
      image: "/category/image.png",
      name: "John Jacobs Full Rim Square Sunglasses",
      quantity: 1,
      price: 0,
    },
  ] as OrderItem[],
  subtotal: 6200,
  discount: 3100,
  fittingFee: 199,
  total: 3299,
  address: {
    name: "Muhammed Javad",
    address: "Edathuruthikaran Holdings, 10/450-2, Kundannoor, Maradu, Ernakulam, Kerala 682304",
    phone: "9744727681",
  },
};

/**
 * Order Success Page
 * Displays order confirmation with details and navigation options
 */
export const OrderSuccessPage = memo(function OrderSuccessPage(): JSX.Element {
  /** Memoize header spacer style */
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  /** Memoize order items */
  const orderItemsList = useMemo(() => (
    ORDER_DATA.items.map((item) => (
      <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain p-2"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h4>
          <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
        </div>
        <div className="text-right">
          {item.price === 0 ? (
            <span className="text-teal-600 font-semibold">FREE</span>
          ) : (
            <span className="font-semibold text-gray-900">₹{item.price}</span>
          )}
        </div>
      </div>
    ))
  ), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      {/* Promotion Header */}
      <PromotionHeader />
      
      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1 py-10">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Success Banner */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-500 mb-4">Thank you for shopping with us</p>

              {/* Order ID */}
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <span className="text-gray-600 text-sm">Order ID:</span>
                <span className="font-semibold text-gray-900">{ORDER_DATA.orderId}</span>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>

              {/* Order Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Order Date</p>
                  <p className="font-medium text-gray-900">{ORDER_DATA.orderDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Estimated Delivery</p>
                  <p className="font-medium text-green-600">{ORDER_DATA.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Payment Method</p>
                  <p className="font-medium text-gray-900">{ORDER_DATA.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Items</p>
                  <p className="font-medium text-gray-900">{ORDER_DATA.items.length} items</p>
                </div>
              </div>

              {/* Order Items */}
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Items Ordered</h3>
              {orderItemsList}

              {/* Price Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{ORDER_DATA.subtotal}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-₹{ORDER_DATA.discount}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Fitting Fee</span>
                  <span className="text-gray-900">₹{ORDER_DATA.fittingFee}</span>
                </div>
                <div className="flex justify-between items-center py-2 mt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total Paid</span>
                  <span className="font-bold text-lg text-gray-900">₹{ORDER_DATA.total}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">{ORDER_DATA.address.name}</p>
                  <p className="text-gray-600 text-sm mb-2">{ORDER_DATA.address.address}</p>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {ORDER_DATA.address.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Options */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Track Order */}
                <Link
                  to="/orders"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Track Order</p>
                    <p className="text-gray-500 text-sm">View order status</p>
                  </div>
                </Link>

                {/* Continue Shopping */}
                <Link
                  to="/"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Continue Shopping</p>
                    <p className="text-gray-500 text-sm">Explore more products</p>
                  </div>
                </Link>

                {/* Download Invoice */}
                <button
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors group text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Download Invoice</p>
                    <p className="text-gray-500 text-sm">Get PDF receipt</p>
                  </div>
                </button>

                {/* Need Help */}
                <Link
                  to="/support"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Need Help?</p>
                    <p className="text-gray-500 text-sm">Contact support</p>
                  </div>
                </Link>
              </div>

              {/* Back to Home Button */}
              <Link
                to="/"
                className="block w-full mt-6 py-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors text-center"
              >
                Back to Home
              </Link>
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

OrderSuccessPage.displayName = "OrderSuccessPage";
