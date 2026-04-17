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

export const OrderSuccessPage = memo(function OrderSuccessPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const orderItemsList = useMemo(() => (
    ORDER_DATA.items.map((item) => (
      <div 
        key={item.id} 
        className="flex gap-4 py-5 border-b border-gray-100 last:border-b-0"
      >
        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain p-2"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 leading-snug mb-1 line-clamp-2">
            {item.name}
          </h4>
          <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
        </div>
        <div className="text-right shrink-0">
          {item.price === 0 ? (
            <span className="text-teal-600 font-bold text-base">FREE</span>
          ) : (
            <span className="font-semibold text-gray-900">₹{item.price}</span>
          )}
        </div>
      </div>
    ))
  ), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Success Banner */}
            <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg 
                  className="w-11 h-11 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="3" 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-600 text-lg mb-6">Thank you for shopping with us</p>

              <div className="inline-flex items-center gap-2 bg-gray-100 px-5 py-2.5 rounded-2xl">
                <span className="text-gray-600 text-sm">Order ID:</span>
                <span className="font-semibold text-gray-900 tracking-wider">{ORDER_DATA.orderId}</span>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>

              {/* Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-8 pb-8 border-b border-gray-200">
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

              {/* Ordered Items */}
              <h3 className="text-base font-semibold text-gray-700 mb-4">Items Ordered</h3>
              <div className="divide-y divide-gray-100">
                {orderItemsList}
              </div>

              {/* Price Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{ORDER_DATA.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-₹{ORDER_DATA.discount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fitting Fee</span>
                    <span className="text-gray-900">₹{ORDER_DATA.fittingFee}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="font-semibold text-lg text-gray-900">Total Paid</span>
                    <span className="font-bold text-2xl text-gray-900">₹{ORDER_DATA.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-5">Delivery Address</h2>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-teal-100 rounded-2xl flex items-center justify-center shrink-0">
                  <svg 
                    className="w-6 h-6 text-teal-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-1">{ORDER_DATA.address.name}</p>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    {ORDER_DATA.address.address}
                  </p>
                  <p className="flex items-center gap-2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {ORDER_DATA.address.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Track Order */}
                <Link
                  to="/orders"
                  className="flex items-center gap-4 p-5 border border-gray-200 rounded-2xl hover:border-teal-500 hover:bg-teal-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center group-hover:bg-teal-200 transition-colors shrink-0">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Track Order</p>
                    <p className="text-gray-500 text-sm">View order status & updates</p>
                  </div>
                </Link>

                {/* Continue Shopping */}
                <Link
                  to="/"
                  className="flex items-center gap-4 p-5 border border-gray-200 rounded-2xl hover:border-teal-500 hover:bg-teal-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:bg-amber-200 transition-colors shrink-0">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Continue Shopping</p>
                    <p className="text-gray-500 text-sm">Explore more eyewear</p>
                  </div>
                </Link>

                {/* Download Invoice */}
                <button
                  className="flex items-center gap-4 p-5 border border-gray-200 rounded-2xl hover:border-teal-500 hover:bg-teal-50 transition-all group text-left w-full"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                  className="flex items-center gap-4 p-5 border border-gray-200 rounded-2xl hover:border-teal-500 hover:bg-teal-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-colors shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Need Help?</p>
                    <p className="text-gray-500 text-sm">Contact our support team</p>
                  </div>
                </Link>
              </div>

              {/* Back to Home Button */}
              <Link
                to="/"
                className="block w-full mt-8 py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-2xl text-center text-base transition-all active:scale-[0.985]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

OrderSuccessPage.displayName = "OrderSuccessPage";