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
  /** True once the two-attempt return limit for this item is exhausted. */
  maxAttemptsReached?: boolean;
  rejectionReason?: string;
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
  /** Admin's rejection reason for a rejected return request. */
  rejectionReason?: string;
  /**
   * Optional customer-safe note from support accompanying the rejection —
   * shown under the structured rejection reason ("Additional note from
   * support: …"), only when present.
   */
  rejectionNote?: string;
  /** Nested/alternate shapes the backend may return for the rejection reason. */
  rejection?: { reason?: string; message?: string; note?: string } | string;
  /**
   * Backend signals the customer has used up their return attempts and no
   * further "Return Again" chance exists for this item.
   */
  maxAttemptsReached?: boolean | number | string;
  finalRejection?: boolean | number | string;
  attemptCount?: number | string;
  rejectionCount?: number | string;
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
