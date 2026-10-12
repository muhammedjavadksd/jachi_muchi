import { api } from "@/shared/lib/axios";
import { getImageUrl } from "@/shared/utils/image";
import { pickPrimaryImage } from "@/shared/utils/imageSrc";
import type { ApiWishlistItem, AddToWishlistRequest } from "@/features/wishlist/types";

interface WishlistApiProduct {
  _id: string;
  name?: string;
  price?: number;
  mrp?: number;
  isActive?: boolean;
  image?: string;
  images?: string[];
  [key: string]: any;
}

interface WishlistApiItem {
  _id?: string;
  // Newer backend returns a `product` snapshot; older payloads populate the
  // product document under `productId`.
  product?: WishlistApiProduct;
  productId?: string | WishlistApiProduct;
  addedAt?: string;
  name?: string;
  price?: number;
  image?: string;
}

interface WishlistApiResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: string;
    items: WishlistApiItem[];
    [key: string]: any;
  };
}

type AddToWishlistApiResponse = WishlistApiResponse;

function transformWishlistItem(item: WishlistApiItem): ApiWishlistItem {
  const productObject: WishlistApiProduct | null =
    item.product && typeof item.product === "object"
      ? item.product
      : item.productId && typeof item.productId === "object"
        ? item.productId
        : null;

  const rawProductId =
    productObject?._id ||
    (typeof item.productId === "string" ? item.productId : "") ||
    "";
  const cleanProductId = String(rawProductId).replace(/^\/product\//, "");

  return {
    _id: item._id || cleanProductId,
    productId: cleanProductId,
    name: productObject?.name || item.name || "Unknown Product",
    price: productObject?.price ?? item.price ?? 0,
    image: getImageUrl(pickPrimaryImage(productObject) || item.image),
    link: `/product/${cleanProductId}`,
    addedAt: item.addedAt || new Date().toISOString(),
  };
}

export async function fetchWishlist(): Promise<ApiWishlistItem[]> {
  try {
    const response = await api.get<WishlistApiResponse>("/wishlist");
    const wishlistData = response.data.data;

    if (!wishlistData?.items) {
      return [];
    }

    return wishlistData.items.map(transformWishlistItem);
  } catch (error: any) {
    console.error("fetchWishlist error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch wishlist");
  }
}

export async function addToWishlistAPI(
  item: AddToWishlistRequest
): Promise<ApiWishlistItem> {
  try {
    const response = await api.post<AddToWishlistApiResponse>("/wishlist/add", item);

    const wishlistData = response.data.data;
    if (!wishlistData?.items?.length) {
      throw new Error("Invalid response from server");
    }

    const lastItem = wishlistData.items[wishlistData.items.length - 1];
    return transformWishlistItem(lastItem);
  } catch (error: any) {
    console.error("addToWishlistAPI error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add item to wishlist");
  }
}

export async function removeFromWishlistAPI(
  productId: string
): Promise<void> {
  try {
    const cleanId = productId.replace(/^\/?(product\/)?/, "");
    await api.delete(`/wishlist/remove/${cleanId}`);
  } catch (error: any) {
    console.error("removeFromWishlistAPI error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to remove item from wishlist");
  }
}

export async function checkWishlistItem(
  productId: string
): Promise<boolean> {
  try {
    const cleanId = productId.replace(/^\/?(product\/)?/, "");
    const response = await api.get(`/wishlist/check/${cleanId}`);
    return response.data.data?.isInWishlist || false;
  } catch {
    return false;
  }
}
