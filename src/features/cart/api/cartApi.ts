import { api } from "@/shared/lib/axios";
import { getProductById } from "@/features/product/api/productApi";

export interface BackendCartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    mrp?: number;
  };
  quantity: number;
  price: number;
  discountedPrice: number | null;
  discount: number;
  isFree: boolean;
  parentItem: string | null;
  offer: string | null;
  color?: { name: string; id: string } | null;
  lens?: { id: string; name: string; price: number } | null;
  powerType?: string | null;
  powerDetails?: {
    leftSPH?: string;
    rightSPH?: string;
    leftCYL?: string | null;
    rightCYL?: string | null;
    isSamePower?: boolean;
    hasCylindrical?: boolean;
    customerName?: string;
    customerPhone?: string;
    knowPowerLater?: boolean;
  } | null;
  bogoGroupId?: string | null;
  freeCount?: number;
  freeUnitPrice?: number;
  setCount?: number;
  isFreeOfferItem?: boolean;
  triggerProduct?: {
    _id: string;
    name: string;
  } | null;
}

export interface BackendCartResponse {
  items: BackendCartItem[];
  bill: Record<string, any>;
  total: number;
  totalSavings: number;
}

const BOGO_FREE_MAX_QTY = 1;

/**
 * Enforce the flat "Buy 1 Get 1" rule on backend cart responses:
 * a cross-product free item (isFreeOfferItem) is a one-time addition tied to
 * the presence of its paid trigger product — never to its quantity. The
 * backend currently scales the free row 1:1 with the paid quantity, so this
 * clamps it back to 1, drops orphans whose trigger was removed, and corrects
 * the bill's offer savings / totals for the excess discount.
 */
function enforceFlatBogoFreeItems(cart: BackendCartResponse): BackendCartResponse {
  if (!cart?.items?.length) return cart;

  const paidGroups = new Set<string>();
  for (const item of cart.items) {
    if (!item.isFreeOfferItem && item.bogoGroupId) paidGroups.add(item.bogoGroupId);
  }

  let excessSavings = 0;
  const items: BackendCartItem[] = [];
  for (const item of cart.items) {
    if (item.isFreeOfferItem && item.bogoGroupId && !paidGroups.has(item.bogoGroupId)) {
      continue;
    }
    if (!item.isFreeOfferItem) {
      items.push(item);
      continue;
    }
    const qty = Math.max(1, Math.round(Number(item.quantity) || 1));
    const clampedQty = Math.min(qty, BOGO_FREE_MAX_QTY);
    const clampedSetCount =
      item.setCount != null ? Math.min(item.setCount, BOGO_FREE_MAX_QTY) : undefined;
    if (qty > clampedQty) {
      const unitPrice = Number(item.discountedPrice ?? item.product?.price ?? 0) || 0;
      excessSavings += unitPrice * (qty - clampedQty);
    }
    items.push({ ...item, quantity: clampedQty, setCount: clampedSetCount });
  }

  if (excessSavings <= 0) {
    return items.length === cart.items.length ? cart : { ...cart, items };
  }

  const bill = cart.bill ? { ...cart.bill } : cart.bill;
  const subtractFromBill = (key: string) => {
    const value = Number(bill[key]);
    if (Number.isFinite(value)) bill[key] = Math.max(0, value - excessSavings);
  };
  const addToBill = (key: string) => {
    const value = Number(bill[key]);
    if (Number.isFinite(value)) bill[key] = value + excessSavings;
  };
  if (bill && typeof bill === "object") {
    subtractFromBill("offerSavings");
    subtractFromBill("offer_discount");
    addToBill("totalPayable");
    addToBill("total");
  }
  const total = Number.isFinite(Number(cart.total))
    ? Number(cart.total) + excessSavings
    : cart.total;

  return { ...cart, items, bill, total };
}

/** Map a backend cart item to the frontend CartItem shape */
export function mapBackendItem(item: BackendCartItem) {
  return {
    cartItemId: item._id,
    bogoGroupId: item.bogoGroupId ?? undefined,
    productId: item.product._id,
    variantId: item.color?.id || undefined,
    productName: item.product.name,
    productPrice: item.discountedPrice ?? item.product.price,
    productImage: item.product.images?.[0] ?? "",
    mrp: item.product.mrp ?? item.product.price,
    quantity: item.quantity,
    color: item.color ?? null,
    lens: item.lens ?? null,
    powerType: item.powerType ?? undefined,
    powerDetails: item.powerDetails ?? null,
    totalPrice: (item.discountedPrice ?? item.product.price) + (item.lens?.price ?? 0),
    isFree: item.isFree,
    freeCount: item.freeCount ?? 0,
    freeUnitPrice: item.freeUnitPrice ?? 0,
    setCount: item.setCount ?? undefined,
    isFreeOfferItem: item.isFreeOfferItem ?? false,
    triggerProductName: item.triggerProduct?.name ?? undefined,
  };
}

export async function fetchCart(): Promise<BackendCartResponse> {
  const res = await api.get("/cart");
  return enforceFlatBogoFreeItems(res.data.data);
}

export async function addToCartApi(payload: {
  productId: string;
  quantity?: number;
  color?: { name: string; id: string } | null;
  lens?: { id: string; name: string; price: number } | null;
  powerType?: string | null;
  powerDetails?: object | null;
  bogoGroupId?: string | null;
  isFree?: boolean;
}): Promise<BackendCartResponse> {
  const res = await api.post("/cart/add", payload);
  return enforceFlatBogoFreeItems(res.data.data);
}

export async function updateCartItemQuantity(
  cartItemId: string,
  action: "increment" | "decrement"
): Promise<BackendCartResponse> {
  const res = await api.patch(`/cart/items/${cartItemId}`, { action });
  return enforceFlatBogoFreeItems(res.data.data);
}

export async function removeCartItemApi(cartItemId: string): Promise<BackendCartResponse> {
  const res = await api.delete(`/cart/item/${cartItemId}`);
  return enforceFlatBogoFreeItems(res.data.data);
}

export async function clearCartApi(): Promise<void> {
  await api.delete("/cart");
}

export function notifyCartUpdated(): void {
  window.dispatchEvent(new Event("cart-updated"));
}

// ---------------------------------------------------------------------------
// Price refresh — hits product API to keep prices/names/images fresh
// ---------------------------------------------------------------------------
interface FreshProductData {
  price: number;
  mrp: number;
  name: string;
  image: string;
  variants: any[];
}

export async function refreshCartPrices(cartItems: any[]): Promise<any[]> {
  if (cartItems.length === 0) return cartItems;

  const uniqueProductIds = [...new Set(cartItems.map((item) => item.productId).filter(Boolean))];

  const productMap: Record<string, FreshProductData> = {};
  await Promise.all(
    uniqueProductIds.map(async (id) => {
      const product = (await getProductById(id as string)) as any;
      if (product && product.price != null) {
        productMap[id as string] = {
          price: product.price,
          mrp: product.mrp ?? product.price,
          name: product.name ?? "",
          image: product.images?.[0] ?? "",
          variants: product.variants ?? [],
        };
      }
    })
  );

  if (Object.keys(productMap).length === 0) return cartItems;

  return cartItems.map((item) => {
    const fresh = productMap[item.productId];
    if (!fresh) return item;
    const matchedVariant = item.color?.name
      ? fresh.variants.find((v: any) => v.color === item.color.name)
      : null;
    return {
      ...item,
      productPrice: fresh.price,
      mrp: fresh.mrp,
      productName: fresh.name || item.productName,
      productImage: fresh.image || item.productImage,
      ...(matchedVariant && {
        color: { ...item.color, name: matchedVariant.color },
      }),
    };
  });
}
