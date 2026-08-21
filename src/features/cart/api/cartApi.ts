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
  return res.data.data;
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
  return res.data.data;
}

export async function updateCartItemQuantity(
  cartItemId: string,
  action: "increment" | "decrement"
): Promise<BackendCartResponse> {
  const res = await api.patch(`/cart/items/${cartItemId}`, { action });
  return res.data.data;
}

export async function removeCartItemApi(cartItemId: string): Promise<BackendCartResponse> {
  const res = await api.delete(`/cart/item/${cartItemId}`);
  return res.data.data;
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
