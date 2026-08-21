import { useState, useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { getMyOrders, cancelOrder } from "@/features/checkout/api/orderApi";
import { retrySkipCashPayment } from "@/features/checkout/api/paymentApi";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

interface OrderItem {
  productId?: string;
  image?: string;
  name?: string;
  quantity?: number;
  totalQuantity?: number;
  price?: number;
  isFree?: boolean;
  bogoGroupId?: string;
  triggerProductName?: string;
  mrp?: number;
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

export interface UseOrdersReturn {
  orders: Order[];
  mappedOrders: (Order & { id: string; date: string; total: number })[];
  loading: boolean;
  selectedOrder: Order | null;
  isDrawerOpen: boolean;
  payNowLoading: string | null;
  handleOrderCancel: (orderId: string) => void;
  handlePayNow: (order: Order) => Promise<void>;
  openOrderDrawer: (order: Order) => void;
  closeOrderDrawer: () => void;
  handleCancelFromDrawer: (orderId: string) => Promise<void>;
  getStatusColors: (status: OrderStatus) => { bg: string; border: string; text: string; badge: string };
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [payNowLoading, setPayNowLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getMyOrders();
        if (!response || !response.success) {
          setOrders([]);
          return;
        }
        const rawOrders: Order[] = response.data || [];

        // Order items now carry snapshot fields (name, image, price)
        // directly from the backend — no live product lookup needed.
        setOrders(rawOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOrderCancel = useCallback((orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order._id === orderId
          ? {
              ...order,
              status: "cancelled" as const,
              statusTimeline: [
                ...(order.statusTimeline || []),
                { status: "cancelled" as const, date: new Date().toISOString() }
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
              { status: "cancelled", date: new Date().toISOString() }
            ]
          }
        : prev
    );
  }, []);

  const handlePayNow = useCallback(async (order: Order) => {
    const orderId = order._id || order.id || "";
    if (!orderId || payNowLoading) return;
    try {
      setPayNowLoading(orderId);
      const res = await retrySkipCashPayment(orderId);
      if (res.success && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        toast.error(res.message || "Failed to retry payment");
      }
    } catch {
      toast.error("Failed to retry payment");
    } finally {
      setPayNowLoading(null);
    }
  }, [payNowLoading]);

  const openOrderDrawer = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  }, []);

  const closeOrderDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedOrder(null);
  }, []);

  const handleCancelFromDrawer = useCallback(async (orderId: string) => {
    try {
      const res = await cancelOrder(orderId);
      if (!res.success) throw new Error("Cancel failed");
      handleOrderCancel(orderId);
      closeOrderDrawer();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order");
    }
  }, [handleOrderCancel, closeOrderDrawer]);

  const getStatusColors = useCallback((status: OrderStatus) => {
    switch (status) {
      case "pending":
      case "confirmed":
        return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100" };
      case "processing":
      case "shipped":
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100" };
      case "delivered":
        return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100" };
      case "cancelled":
        return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100" };
      case "refunded":
        return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", badge: "bg-gray-100" };
      default:
        return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100" };
    }
  }, []);

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

  return {
    orders,
    mappedOrders,
    loading,
    selectedOrder,
    isDrawerOpen,
    payNowLoading,
    handleOrderCancel,
    handlePayNow,
    openOrderDrawer,
    closeOrderDrawer,
    handleCancelFromDrawer,
    getStatusColors,
  };
}
