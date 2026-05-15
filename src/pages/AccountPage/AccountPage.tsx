import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";
import { getMyOrders, cancelOrder } from "../../api/order";
import { getImageUrl } from "../../lib/image";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** Sidebar menu items */
const SIDEBAR_MENU = [
  { id: "orders", label: "MY ORDERS", icon: null, link: "/account" },
  { id: "3d-model", label: "MY 3D MODEL", icon: "3d", link: "/account/3d-model" },
  { id: "account-info", label: "ACCOUNT INFORMATION", icon: null, link: "/account/info" },
  { id: "notifications", label: "MANAGE NOTIFICATIONS", icon: null, link: "/account/notifications" },
  { id: "address", label: "ADDRESS BOOK", icon: null, link: "/account/address" },
  { id: "prescriptions", label: "MY PRESCRIPTIONS", icon: null, link: "/account/prescriptions" },
];

/** Brand logos for contact lens section */
const CONTACT_LENS_BRANDS = ["B+L", "Alcon", "J&J", "ACUVUE"];

/** Order status type - matches backend exactly */
type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

/** Order item interface (matches API response) */
interface OrderItem {
  image?: string;
  name?: string;
  quantity?: number;
  price?: number;
}

/** Order interface (matches API response) */
interface Order {
  _id?: string;
  id?: string;
  orderId?: string;
  totalAmount?: number;
  status?: OrderStatus;
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
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded";
    date: string;
  }[];
}

/**
 * Order Details Drawer Component
 */
const OrderDrawer = memo(function OrderDrawer({
  order,
  isOpen,
  onClose,
  onCancelSuccess,
}: {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelSuccess?: (orderId: string) => void;
}): JSX.Element | null {

  const [cancelLoading, setCancelLoading] = useState(false);

  /** Disable body scroll when drawer is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
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

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancelLoading(true);

      const res = await cancelOrder(order._id!);

      if (!res.success) {
        throw new Error("Cancel failed");
      }

      alert("Order cancelled successfully");

      if (onCancelSuccess && order._id) {
        onCancelSuccess(order._id);
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order");
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

  // If cancelled → show full history till cancelled
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

  const stepsOrder = ["pending", "confirmed", "shipped", "delivered"];

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


  /** Get display label for status (capitalize first letter) */
  const getStatusLabel = (status: string) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  /** Get status color classes */
  const getDrawerStatusColors = (status: string) => {
    switch (status) {
      case "pending":
      case "confirmed":
        return "bg-amber-100 text-amber-700";
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
      {/* Backdrop - z-[100] to be above header */}
      <div
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />

      {/* Drawer - z-[101] to be above backdrop and header */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[480px] bg-white shadow-2xl z-[101] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500">{order.orderId || order._id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Status Badge */}
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

          {/* Product Details */}
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

          {/* Payment Details */}
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

           {/* Order Status / Tracking */}
           {/* {order.trackingSteps && ( */}
           {getTrackingSteps().length > 0 && (
             <div className="mb-6">
               <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Status</h3>
               <div className="relative">
                 {getTrackingSteps().map((step, idx) => (
                   <div key={idx} className="flex gap-4 pb-4 last:pb-0">
                     {/* Line */}
                     {idx < getTrackingSteps().length - 1 && (
                       <div className={`absolute left-[11px] top-6 w-0.5 ${step.completed ? "bg-teal-500" : "bg-gray-200"
                         }`} style={{ transform: `translateY(${idx * 56}px)`, height: "40px" }} />
                     )}
                     {/* Dot */}
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${step.completed ? "bg-teal-500" : "bg-gray-200"
                       }`}>
                       {step.completed && (
                         <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                         </svg>
                       )}
                     </div>
                     {/* Content */}
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
                   <button
                     onClick={onClose}
                     className="mt-3 w-full py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                   >
                     Got it
                   </button>
                 </div>
               )}
             </div>
           )}

          {/* Delivery Address */}
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

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Download Invoice */}
            <button className="w-full py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Invoice
            </button>

            {/* {displayStatus === "pending" || displayStatus === "confirmed" || displayStatus === "shipped" ? ( */}
            {["pending", "confirmed"].includes(displayStatus) ? (
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="w-full py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50">
                {cancelLoading ? "Cancelling..." : "Cancel Order"}
              </button>
            ) : null}

            {/* {displayStatus === "delivered" && (
              <button className="w-full py-3 bg-amber-50 text-amber-700 font-medium rounded-lg hover:bg-amber-100 transition-colors border border-amber-200 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Write a Review
              </button>
            )} */}

            <button className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Customer Support
            </button>

            {displayStatus === "delivered" && (
              <button className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                Reorder
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

OrderDrawer.displayName = "OrderDrawer";

/**
 * Account Page
 * User account dashboard with sidebar navigation
 */
export const AccountPage = memo(function AccountPage(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);

  const location = useLocation();

  /** Memoize header spacer style */
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  /** Fetch orders from API */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getMyOrders();

        if (!response || !response.success) {
          setOrders([]);
          return;
        }

        setOrders(response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  /** Toggle WhatsApp updates */
  const toggleWhatsappUpdates = useCallback(() => {
    setWhatsappUpdates(prev => !prev);
  }, []);

  /** Open order drawer */
  const openOrderDrawer = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  }, []);

  /** Close order drawer */
  const closeOrderDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedOrder(null);
  }, []);

  /** Handle order cancel success - update state without reload */
  const handleOrderCancel = useCallback((orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order._id === orderId
          ? {
              ...order,
              status: "cancelled" as const,
              statusTimeline: [
                ...(order.statusTimeline || []),
                {
                  status: "cancelled" as const,
                  date: new Date().toISOString()
                }
              ]
            }
          : order
      )
    );
    setSelectedOrder(prev =>
    prev && prev._id === orderId
      ? {
          ...prev,
          status: "cancelled",
          statusTimeline: [
            ...(prev.statusTimeline || []),
            {
              status: "cancelled",
              date: new Date().toISOString()
            }
          ]
        }
      : prev
  );
  }, []);

  /** Memoize sidebar menu - highlight based on URL */
  const sidebarMenu = useMemo(() => (
    SIDEBAR_MENU.map((item) => {
      const isActive = location.pathname === item.link;
      return (
        <Link
          key={item.id}
          to={item.link}
          className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors flex items-center justify-between border-b border-gray-200 last:border-b-0 ${isActive
            ? "bg-teal-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <span>{item.label}</span>
          {item.icon === "3d" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          )}
        </Link>
      );
    })
  ), [location.pathname]);

  /** Memoize brand logos */
  const brandLogos = useMemo(() => (
    CONTACT_LENS_BRANDS.map((brand, index) => (
      <span
        key={index}
        className={`text-sm font-bold ${brand === "B+L" ? "text-blue-600" :
          brand === "Alcon" ? "text-teal-600" :
            brand === "J&J" ? "text-red-600" :
              "text-blue-800"
          }`}
      >
        {brand}
      </span>
    ))
  ), []);

  /** Get status color classes */
  const getStatusColors = useCallback((status: OrderStatus) => {
    switch (status) {
      case "pending":
      case "confirmed":
        return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100" };
      case "shipped":
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100" };
      case "delivered":
        return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100" };
      case "cancelled":
        return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100" };
      case "refunded":
        return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", badge: "bg-gray-100" };
      default:
        // Unknown status treated as pending
        return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100" };
    }
  }, []);

  /** Map API order to display format */
  const mappedOrders = useMemo(() =>
    orders.map((order, index) => ({
      ...order,
      id: order._id || order.id || `order-${index}`,
      orderId: order.orderId || order._id || `ORD${index}`,
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A",
      status: order.status || "pending",
      items: order.items || [],
      total: order.total || order.totalAmount || 0,
    })), [orders]);


  

  return (
    <div className="w-full min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Promotion Header */}
      <PromotionHeader />

      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1 py-4 md:py-6">
        <Container>
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
            {/* Left Sidebar - Sticky */}
            <div
              className="w-full lg:w-64 lg:shrink-0 lg:sticky hidden lg:block"
              style={{ top: `${PROMOTION_HEADER_HEIGHT + 24}px` }}
            >
              <nav className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                {sidebarMenu}
              </nav>
            </div>

            {/* Mobile Sidebar - Collapsible */}
            <div className="lg:hidden w-full">
              <details className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <summary className="px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer list-none flex items-center justify-between">
                  <span>Account Menu</span>
                  <svg className="w-5 h-5 text-gray-500 transition-transform open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-gray-200">
                  {sidebarMenu}
                </div>
              </details>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 min-w-0">
              {/* Top Section - WhatsApp Toggle & Logout */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 md:mb-6 lg:mb-8">
                {/* WhatsApp Updates Toggle */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-xs sm:text-sm">Get Order Updates on WhatsApp</span>
                  {/* Toggle Switch */}
                  <button
                    onClick={toggleWhatsappUpdates}
                    className={`relative w-11 h-5 sm:w-12 sm:h-6 rounded-full transition-colors ${whatsappUpdates ? "bg-teal-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform ${whatsappUpdates ? "translate-x-6 sm:translate-x-7" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                {/* Logout Button */}
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors">
                  LOGOUT
                </button>
              </div>

              {/* Contact Lens Orders Card */}
              {/* <div className="border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-5 mb-4 md:mb-6"> */}
                {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Contact Lens orders</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">View orders from these brands</p>
                      <div className="flex items-center gap-3 sm:gap-4 mt-1 sm:mt-2">
                        {brandLogos}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/account/contact-lens-orders"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded hover:bg-teal-700 transition-colors"
                  >
                    VIEW ORDERS
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div> */}
              {/* </div> */}

              {/* Orders List */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Orders</h3>

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-20 text-gray-500">
                    Loading...
                  </div>
                )}

                {/* Empty State */}
                {!loading && mappedOrders.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    No orders found
                  </div>
                )}

                {/* Orders List */}
                {!loading && mappedOrders.map((order) => {
                  const colors = getStatusColors(order.status as OrderStatus);
                  const items = order.items || [];
                  return (
                    <div
                      key={order.id}
                      className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => openOrderDrawer(order)}
                    >
                      {/* Order Header */}
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
                          {/* Status Badge */}
                          <span className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${colors.badge} ${colors.text}`}>
                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
                          </span>
                        </div>
                      </div>

                      {/* Order Items Preview */}
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
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Order Details Drawer */}
      <OrderDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={closeOrderDrawer}
        onCancelSuccess={handleOrderCancel}
      />
    </div>
  );
});

AccountPage.displayName = "AccountPage";
