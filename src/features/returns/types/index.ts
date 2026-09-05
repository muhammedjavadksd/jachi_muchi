export type ReturnStatusKey =
  | "requested"
  | "accepted"
  | "collected"
  | "refunded"
  | "rejected";

/** Fixed reason options — must match the backend enum exactly. */
export type ReturnReason =
  | "Product damaged or defective"
  | "Wrong product received"
  | "Size / fit issue"
  | "Product not as described"
  | "Changed my mind"
  | "Missing parts or accessories";

export interface ReturnEligibility {
  eligible?: boolean;
  reason?: string;
  deadline?: string;
}

export interface ReturnCreateRequest {
  orderId: string;
  orderItemId: string;
  reason: ReturnReason;
  billImage: File;
  productImage: File;
}

export interface ReturnCreateResponse {
  message?: string;
  returnId?: string;
  success?: boolean;
}

export interface MyReturnItem {
  _id?: string;
  returnId?: string;
  orderId?: string;
  orderItemId?: string;
  reason?: string;
  status?: string | ReturnStatusKey;
  rejectionReason?: string;
  billImage?: string;
  productImage?: string;
  createdAt?: string;
  requestedAt?: string;
  acceptedAt?: string;
  collectedAt?: string;
  refundedAt?: string;
  rejectedAt?: string;
  statusTimeline?: {
    status?: string | ReturnStatusKey;
    date?: string;
    timestamp?: string;
  }[];
  product?: {
    name?: string;
    image?: string;
  } | null;
}

export interface MyReturnsResponse {
  success?: boolean;
  data?: MyReturnItem[];
  message?: string;
}
