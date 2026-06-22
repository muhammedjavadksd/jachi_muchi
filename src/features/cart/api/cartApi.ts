import { api } from "@/shared/lib/axios";

const MONGO_ID_RE = /^[0-9a-fA-F]{24}$/;

function isValidObjectId(id: string): boolean {
  return MONGO_ID_RE.test(id);
}

export async function updateCartItemQuantity(
  cartItemId: string,
  action: "increment" | "decrement"
): Promise<any> {
  const response = await api.patch(`/cart/items/${cartItemId}`, { action });
  return response.data;
}

export function assertValidCartItemId(cartItemId: string, origin: string): boolean {
  if (!isValidObjectId(cartItemId)) {
    console.error(
      `[Cart] Invalid cart item ID at ${origin}: "${cartItemId}" is not a 24-character hex MongoDB ObjectId. ` +
      "This item was created with a client-generated timestamp (Date.now()) and was never synced to the backend, " +
      "because POST /api/cart/items does not exist. Skipping backend PATCH to avoid a guaranteed 404. " +
      "Quantity change applied locally in localStorage.",
      new Error("Stack trace for invalid cartItemId origin")
    );
    return false;
  }
  return true;
}
