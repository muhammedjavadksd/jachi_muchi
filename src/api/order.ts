import { api } from "./axios";

/** Color variant data for order item */
export interface OrderItemColor {
  id: string;
  name: string;
}

/** Lens data for order item */
export interface OrderItemLens {
  id?: string;
  name: string;
  price: number;
}

/** Order item for creating an order */
export interface CreateOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: OrderItemColor;
  lens?: OrderItemLens;
  powerDetails?: OrderItemPowerDetails;
}

/** Power details for prescription lenses */
export interface OrderItemPowerDetails {
  leftSPH?: string;
  rightSPH?: string;
  leftCYL?: string | null;
  rightCYL?: string | null;
  isSamePower?: boolean;
  hasCylindrical?: boolean;
  customerName: string;
  customerPhone: string;
  knowPowerLater?: boolean;
}

/** Order item for creating an order */
export interface CreateOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lens?: OrderItemLens;
  powerDetails?: OrderItemPowerDetails;
}

/** Payload for creating an order */
export interface CreateOrderPayload {
  items: CreateOrderItem[];
  addressId: string;
  totalAmount: number;
  paymentMethod?: string;
}

export const getMyOrders = async () => {
  try {
    const res = await api.get("/orders/my");
    return res.data;
  } catch (error) {
    console.error("getMyOrders error:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId: string) => {
  try {
    const res = await api.put(`/orders/${orderId}/cancel`);
    return res.data;
  } catch (error) {
    console.error("cancelOrder error:", error);
    throw error;
  }
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const res = await api.post("/orders", payload);
  return res.data;
};

export const getOrderById = async (orderId: string) => {
  try {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  } catch (error) {
    console.error("getOrderById error:", error);
    throw error;
  }
};