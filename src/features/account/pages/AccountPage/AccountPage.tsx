import { memo, useMemo, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getImageUrl } from "@/shared/utils/image";
import { cancelOrder } from "@/features/checkout/api/orderApi";
import { useOrders } from "@/features/account/hooks";

const CONTACT_LENS_BRANDS = ["B+L", "Alcon", "J&J", "ACUVUE"];

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

interface OrderItem {
  image?: string;
  name?: string;
  quantity?: number;
  price?: number;
}

interface Order {
  _id?: string;
  id?: string;
  orderId?: string;
  totalAmount?: number;
  status?: OrderStatus;
  paymentStatus?: string;
  createdAt?: string;
  items?: OrderItem[];
  subtotal?: number;
  discount?: number;
  shipping?: number;
  total?: number;
  deliveryDate?: string;
  paymentMethod?: string;
  address?: string;
  statusTimeline?: {
    status: OrderStatus;
    date: string;
  }[];
}

const OrderDrawer = memo(function OrderDrawer({
  order,
  isOpen,
  onClose,
  onCancelSuccess,
  onPayNow,
  isProcessingPayment,
}: {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelSuccess?: (orderId: string) => void;
  onPayNow?: (order: Order) => void;
  isProcessingPayment?: boolean;
}): JSX.Element | null {

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const displayStatus = order.status || "pending";
  const items = order.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const shipping = (order.totalAmount || 0) - subtotal;
  const safeShipping = shipping > 0 ? shipping : 0;

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    try {
      setCancelLoading(true);
      const res = await cancelOrder(order._id!);
      if (!res.success) throw new Error("Cancel failed");
      toast.success("Order cancelled successfully");
      if (onCancelSuccess && order._id) {
        onCancelSuccess(order._id);
      }
      setShowCancelModal(false);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel order. Try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  const getTrackingSteps = () => {
    const timeline = order.statusTimeline || [];

    const statusIcons: Record<string, JSX.Element> = {
      pending: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      confirmed: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      processing: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      shipped: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      delivered: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      cancelled: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };

    if (order.status === "cancelled") {
      const stepsOrder = ["pending", "confirmed", "cancelled"];
      return stepsOrder.map((step) => {
        const matched = timeline.find(t => t.status === step);
        return {
          label: step.charAt(0).toUpperCase() + step.slice(1),
          date: matched ? new Date(matched.date).toLocaleDateString() : "",
          completed: !!matched,
          icon: statusIcons[step]
        };
      });
    }

    const stepsOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];
    return stepsOrder.map((step) => {
      const matched = timeline.find(t => t.status === step);
      return {
        label: step.charAt(0).toUpperCase() + step.slice(1),
        date: matched ? new Date(matched.date).toLocaleDateString() : "",
        completed: !!matched,
        icon: statusIcons[step]
      };
    });
  };

  const getStatusLabel = (status: string) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getDrawerStatusColors = (status: string) => {
    switch (status) {
      case "pending":
      case "confirmed":
        return "bg-amber-100 text-amber-700";
      case "processing":
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const statusColors = getDrawerStatusColors(displayStatus);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[480px] bg-white shadow-2xl z-[101] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500">{order.orderId || order._id}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusColors}`}>
              {displayStatus === "delivered" && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {getStatusLabel(displayStatus)}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Products</h3>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <img src={getImageUrl(item.image)} alt={item.name || "Product"} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name || "Unnamed Product"}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity || 1}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {item.price === 0 ? <span className="text-teal-600">FREE</span> : `₹${item.price}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600 text-sm">Subtotal</span>
                <span className="text-gray-900 text-sm">₹{subtotal}</span>
              </div>
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 text-sm">Discount</span>
                  <span className="text-green-600 text-sm">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-gray-600 text-sm">Shipping</span>
                <span className="text-gray-900 text-sm">{safeShipping === 0 ? "FREE" : `₹${safeShipping}`}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                <span className="text-gray-900 font-semibold">Total</span>
                <span className="text-gray-900 font-bold">₹{order.total || order.totalAmount || 0}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-sm text-gray-600">{order.paymentMethod || "N/A"}</span>
              </div>
            </div>
          </div>

          {getTrackingSteps().length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Status</h3>
              <div className="relative">
                {getTrackingSteps().map((step, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 last:pb-0">
                    {idx < getTrackingSteps().length - 1 && (
                      <div className={`absolute left-[11px] top-6 w-0.5 ${step.completed ? "bg-teal-500" : "bg-gray-200"}`} style={{ transform: `translateY(${idx * 56}px)`, height: "40px" }} />
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${step.completed ? "bg-teal-500" : "bg-gray-200"}`}>
                      {step.completed && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${step.completed ? "text-gray-900" : "text-gray-400"} flex items-center gap-2`}>
                        {step.completed && step.icon && (
                          <span className="text-teal-600">{step.icon}</span>
                        )}
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {order.status === "cancelled" && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">Order Cancelled</p>
                  <button onClick={onClose} className="mt-3 w-full py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">Got it</button>
                </div>
              )}
            </div>
          )}

          {order.address && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Delivery Address</h3>
              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-600">{order.address}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button className="w-full py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Invoice
            </button>

            {["pending", "confirmed"].includes(displayStatus) ? (
              <button onClick={handleCancelOrder} disabled={cancelLoading} className="w-full py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50">
                {cancelLoading ? "Cancelling..." : "Cancel Order"}
              </button>
            ) : null}

            {order.paymentMethod !== "COD" && (order.paymentStatus === "failed" || order.paymentStatus === "pending") && onPayNow && (
              <button onClick={(e) => { e.stopPropagation(); onPayNow(order); }} disabled={isProcessingPayment} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all active:scale-[0.985] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:active:scale-100">
                {isProcessingPayment ? "Processing..." : "Pay Now"}
              </button>
            )}

            <button className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Customer Support
            </button>

            {displayStatus === "delivered" && (
              <button className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">Reorder</button>
            )}
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Order?</h3>
              <p className="text-sm text-gray-600">Are you sure you want to cancel this order? This action cannot be undone.</p>
              {order.orderId && (
                <p className="text-xs text-gray-400 mt-2">Order #{order.orderId}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all"
              >
                Keep Order
              </button>
              <button
                onClick={confirmCancelOrder}
                disabled={cancelLoading}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

OrderDrawer.displayName = "OrderDrawer";

export const AccountPage = memo(function AccountPage(): JSX.Element {
  const {
    mappedOrders,
    loading,
    selectedOrder,
    isDrawerOpen,
    payNowLoading,
    handleOrderCancel,
    handlePayNow,
    openOrderDrawer,
    closeOrderDrawer,
    getStatusColors,
  } = useOrders();

  const [whatsappUpdates, setWhatsappUpdates] = useState(false);

  const toggleWhatsappUpdates = useCallback(() => {
    setWhatsappUpdates(prev => !prev);
  }, []);

  const brandLogos = useMemo(() => (
    CONTACT_LENS_BRANDS.map((brand, index) => (
      <span key={index} className={`text-sm font-bold ${brand === "B+L" ? "text-blue-600" : brand === "Alcon" ? "text-teal-600" : brand === "J&J" ? "text-red-600" : "text-blue-800"}`}>
        {brand}
      </span>
    ))
  ), []);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 md:mb-6 lg:mb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <span className="text-gray-700 text-xs sm:text-sm">Get Order Updates on WhatsApp</span>
          <button onClick={toggleWhatsappUpdates} className={`relative w-11 h-5 sm:w-12 sm:h-6 rounded-full transition-colors ${whatsappUpdates ? "bg-teal-600" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform ${whatsappUpdates ? "translate-x-6 sm:translate-x-7" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Orders</h3>

        {loading && (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        )}

        {!loading && mappedOrders.length === 0 && (
          <div className="text-center py-20 text-gray-500">No orders found</div>
        )}

        {!loading && mappedOrders.map((order) => {
          const colors = getStatusColors(order.status as OrderStatus);
          const items = order.items || [];
          return (
            <div key={order.id} className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow`} onClick={() => openOrderDrawer(order)}>
              <div className="px-3 sm:px-4 lg:px-5 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">{order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-700 text-xs sm:text-sm lg:text-base">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">₹{order.total}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${colors.badge} ${colors.text}`}>
                    {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
                  </span>
                </div>
              </div>

              <div className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  {items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <img src={getImageUrl(item.image)} alt={item.name || "Product"} className="w-full h-full object-contain p-0.5 sm:p-1" />
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg flex items-center justify-center border border-gray-200 shrink-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">+{items.length - 3}</span>
                    </div>
                  )}
                  <div className="ml-auto flex items-center gap-1 sm:gap-2 text-teal-600 shrink-0">
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">View Details</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {order.paymentMethod === "COD" ? (
                <div className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4">
                  <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                    <span className="text-xs font-medium text-green-600">Cash on Delivery</span>
                    <span className="text-xs text-gray-400">Pay at doorstep</span>
                  </div>
                </div>
              ) : (order.paymentStatus === "failed" || order.paymentStatus === "pending") ? (
                <div className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4">
                  <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                    <span className="text-xs font-medium text-red-600">
                      Payment {order.paymentStatus === "failed" ? "Failed" : "Pending"}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); handlePayNow(order); }} disabled={payNowLoading === order.id} className="px-5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-all active:scale-[0.985] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:active:scale-100">
                      {payNowLoading === order.id ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                </div>
              ) : order.paymentStatus === "paid" ? (
                <div className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4">
                  <div className="flex items-center border-t border-gray-200 pt-3">
                    <span className="text-xs font-medium text-green-600">Payment Paid</span>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <OrderDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={closeOrderDrawer}
        onCancelSuccess={handleOrderCancel}
        onPayNow={handlePayNow}
        isProcessingPayment={payNowLoading === (selectedOrder?._id || selectedOrder?.id)}
      />
    </>
  );
});

AccountPage.displayName = "AccountPage";
