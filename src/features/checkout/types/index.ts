export interface PowerDetails {
  leftSPH?: string;
  rightSPH?: string;
  leftCYL?: string;
  rightCYL?: string;
  isSamePower: boolean;
  hasCylindrical: boolean;
  customerName: string;
  customerPhone: string;
}

export interface OrderItemColor {
  id: string;
  name: string;
}

export interface OrderItemLens {
  id?: string;
  name: string;
  price: number;
}

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

export interface CreateOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: OrderItemColor;
  lens?: OrderItemLens;
  powerDetails?: OrderItemPowerDetails;
}

export interface CreateOrderPayload {
  items: CreateOrderItem[];
  addressId: string;
  totalAmount: number;
  paymentMethod?: string;
}

export interface CreateSkipCashPaymentPayload {
  orderId: string;
  amount: number;
  customerName: string;
  email: string;
  phone: string;
}

export interface CreateSkipCashPaymentResponse {
  success: boolean;
  data?: {
    paymentUrl: string;
    transactionId?: string;
    paymentId?: string;
  };
  message?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderId?: string;
  status?: string;
}

export interface SkipCashVerifyQuery {
  transactionId: string;
  paymentId?: string;
  statusId?: string;
}

export interface SkipCashVerifyResponse {
  success: boolean;
  data?: {
    status: "paid" | "failed" | "pending";
    orderId?: string;
  };
}

export interface RetryPaymentResponse {
  success: boolean;
  checkoutUrl?: string;
  message?: string;
}
