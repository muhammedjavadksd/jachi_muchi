export type TrackStepKey = "pending" | "confirmed" | "processing" | "shipped" | "delivered";

export type TrackStatusKey =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface TrackTimelineEntry {
  status?: string;
  timestamp?: string;
  date?: string;
}

export interface TrackOrderItem {
  productId?: string;
  image?: string;
  name?: string;
  quantity?: number;
  price?: number;
  color?: { id: string; name: string } | null;
}

export interface TrackShippingAddress {
  name?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface TrackOrderData {
  _id?: string;
  id?: string;
  orderId?: string;
  status?: string;
  orderStatus?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt?: string;
  estimatedDelivery?: string;
  deliveryDate?: string;
  timeline?: TrackTimelineEntry[];
  statusTimeline?: TrackTimelineEntry[];
  items?: TrackOrderItem[];
  shippingAddress?: TrackShippingAddress;
  address?: TrackShippingAddress | string;
  total?: number;
  totalAmount?: number;
}

export interface TrackOrderResponse {
  success?: boolean;
  data?: TrackOrderData;
  message?: string;
}

export interface TrackingStep {
  key: TrackStepKey;
  label: string;
  timestamp?: string;
  state: "completed" | "current" | "future";
}
