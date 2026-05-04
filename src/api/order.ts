import { api } from "./axios";

/** Order item for creating an order */
export interface CreateOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

/** Payload for creating an order */
export interface CreateOrderPayload {
  items: CreateOrderItem[];
  addressId: string;
  totalAmount: number;
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