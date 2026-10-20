/**
 * How the customer supplied their power on Step 3.
 * "manual" → powerDetails form; "upload" → prescriptionFile holds the uploaded
 * document URL. "later" is legacy — the storefront no longer offers it, but it
 * stays in the union so old carts and orders that carry it keep validating.
 */
export type PowerMethod = "later" | "manual" | "upload";

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
  customerName?: string;
  customerPhone?: string;
  knowPowerLater?: boolean;
  /** Step 3 choice. Optional so items saved before it existed keep working. */
  powerMethod?: PowerMethod;
  /** Upload method only — hosted URL of the uploaded prescription. */
  prescriptionFile?: string;
  /** Legacy "later" method only — ISO date the power was due by. */
  powerDueDate?: string;
}

export interface CreateOrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image?: string;
  price: number;
  totalQuantity: number;
  setCount: number;
  isFree?: boolean;
  freeCount?: number;
  freeUnitPrice?: number;
  bogoGroupId?: string;
  color?: OrderItemColor;
  lens?: OrderItemLens;
  powerType?: string;
  powerDetails?: OrderItemPowerDetails;
}

export interface CreateOrderPayload {
  items: CreateOrderItem[];
  addressId: string;
  totalAmount: number;
  paymentMethod?: string;
}

export type SkipCashSessionStatus = "INITIATED" | "COMPLETED" | "FAILED" | "EXPIRED";

export interface InitiateSkipCashPaymentPayload {
  items: CreateOrderItem[];
  addressId: string;
  totalAmount: number;
  couponCode?: string;
}

export interface InitiateSkipCashPaymentResponse {
  success: boolean;
  data?: {
    ref: string;
    paymentUrl: string;
    amount?: number;
    currency?: string;
    expiresAt?: string;
  };
  message?: string;
}

export interface SkipCashSessionStatusResponse {
  success?: boolean;
  message?: string;
  data?: {
    status: SkipCashSessionStatus;
    orderId?: string;
  };
  status?: SkipCashSessionStatus;
  orderId?: string;
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
