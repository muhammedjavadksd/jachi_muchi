import { memo, useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "@/components";
import { Container } from "@/shared/components/Container/Container";
import { getOrderById } from "@/features/checkout/api/orderApi";

const PROMOTION_HEADER_HEIGHT = 140;

interface OrderItem {
  id?: string;
  productId?: string;
  name: string;
  quantity?: number;
  totalQuantity?: number;
  price?: number;
  totalPrice?: number;
  productPrice?: number;
  color?: { id: string; name: string } | null;
  isFree?: boolean;
  bogoGroupId?: string;
  triggerProductName?: string;
  mrp?: number;
}

interface OrderAddress {
  name?: string;
  fullAddress?: string;
  phone?: string;
}

interface OrderData {
  orderId?: string;
  createdAt?: string;
  orderDate?: string;
  estimatedDelivery?: string;
  paymentMethod?: string;
  items?: OrderItem[];
  subtotal?: number;
  discount?: number;
  fittingFee?: number;
  total?: number;
  address?: OrderAddress;
}

export const OrderSuccessPage = memo(function OrderSuccessPage(): JSX.Element {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(id);

        if (!response || !response.success || !response.data) {
          setOrder(null);
          return;
        }

        const order = response.data;

        const addr = order.shippingAddress || order.address || {};
        const fullAddress = [
          addr.addressLine1,
          addr.addressLine2,
          addr.city,
          addr.state,
          addr.pincode,
        ].filter(Boolean).join(", ");

        setOrder({
          orderId: order._id,
          createdAt: order.createdAt,
          paymentMethod: order.paymentMethod,
          items: (order.items || []).map((item: any) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity || item.totalQuantity,
            price: item.price,
            color: item.color || null,
            isFree: item.isFree || false,
            bogoGroupId: item.bogoGroupId || undefined,
            triggerProductName: item.triggerProductName || undefined,
            mrp: item.mrp || undefined,
          })),
          total: order.totalAmount,
          discount: order.discount,
          address: {
            name: addr.name || "User",
            fullAddress: fullAddress || "N/A",
            phone: addr.phone || "N/A"
          }
        });
      } catch (error) {
        console.error("Error fetching order:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const safeItems = useMemo(() => order?.items || [], [order]);

  const orderId = useMemo(() => order?.orderId, [order]);

  const orderDate = useMemo(() =>
    order?.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : "", [order]);

  const estimatedDelivery = useMemo(() =>
    order?.estimatedDelivery || "3-5 days", [order]);

  const subtotal = useMemo(() => {
    if (order?.subtotal !== undefined) return order.subtotal;
    return safeItems.reduce((sum, item) => {
      const qty = item.totalQuantity || item.quantity || 1;
      return sum + (item.price || 0) * qty;
    }, 0);
  }, [order, safeItems]);

  const total = useMemo(() =>
    order?.total ?? subtotal, [order, subtotal]);

  const discount = useMemo(() => {
    if (order?.discount !== undefined) return order.discount;
    return subtotal > total ? subtotal - total : 0;
  }, [order, subtotal, total]);

  const offerSavings = useMemo(() =>
    safeItems.filter(item => item.isFree).reduce((sum, item) => {
      const qty = item.totalQuantity || item.quantity || 1;
      return sum + (item.price || 0) * qty;
    }, 0), [safeItems]);

  const totalSaved = discount + offerSavings;

  const fittingFee = 199;

  const addressName = order?.address?.name || "N/A";
  const addressFull = order?.address?.fullAddress || "";
  const addressPhone = order?.address?.phone || "N/A";

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <PromotionHeader />
        <div style={spacerStyle} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading order...</p>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <PromotionHeader />
        <div style={spacerStyle} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Order not found</p>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
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
                <span className="font-semibold text-gray-900 tracking-wider">{orderId}</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Order Date</p>
                  <p className="font-medium text-gray-900">{orderDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Estimated Delivery</p>
                  <p className="font-medium text-green-600">{estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Payment Method</p>
                  <p className="font-medium text-gray-900">{order.paymentMethod || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Items</p>
                  <p className="font-medium text-gray-900">{safeItems.length} items</p>
                </div>
              </div>

              <h3 className="text-base font-semibold text-gray-700 mb-4">Items Ordered</h3>
              <div className="divide-y divide-gray-100">
                {safeItems.map((item, index) => {
                  const isFree = !!item.isFree;
                  return (
                    <div key={index} className="py-3">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            {isFree && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">Qty: {item.totalQuantity || item.quantity || 1}</p>
                          {item.color && (
                            <p className="text-sm text-gray-500">Color: {item.color.name}</p>
                          )}
                          {isFree && item.triggerProductName && (
                            <p className="text-xs text-green-600 mt-0.5">Free with {item.triggerProductName}</p>
                          )}
                        </div>
                        <div className="text-right ml-4 shrink-0">
                          {isFree ? (
                            <div>
                              <p className="text-sm text-gray-400 line-through">₹{formatPrice(item.price)}</p>
                              <p className="font-bold text-green-600">FREE</p>
                            </div>
                          ) : (
                            <p className="font-medium text-gray-900">₹{formatPrice(item.price)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{formatPrice(subtotal)}</span>
                  </div>
                  {totalSaved > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Offer Savings</span>
                      <span className="text-green-600 font-medium">-₹{formatPrice(totalSaved)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fitting Fee</span>
                    <span className="text-gray-900">₹{fittingFee}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="font-semibold text-lg text-gray-900">Total Paid</span>
                    <span className="font-bold text-2xl text-gray-900">₹{formatPrice(total)}</span>
                  </div>
                  {totalSaved > 0 && (
                    <p className="text-sm text-green-600 font-medium">You saved ₹{formatPrice(totalSaved)} on this order</p>
                  )}
                </div>
              </div>
            </div>

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
                  <p className="font-medium text-gray-900 mb-1">{addressName}</p>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    {addressFull}
                  </p>
                  <p className="flex items-center gap-2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {addressPhone}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/account/orders"
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
