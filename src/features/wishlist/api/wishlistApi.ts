import { api } from "@/shared/lib/axios";
import { getImageUrl } from "@/shared/utils/image";
import type { ApiWishlistItem, AddToWishlistRequest } from "@/features/wishlist/types";

interface WishlistApiResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: string;
    items: Array<{
      productId: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        [key: string]: any;
      };
      addedAt: string;
    }>;
    [key: string]: any;
  };
}

interface AddToWishlistApiResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: string;
    items: Array<{
      productId: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        [key: string]: any;
      };
      addedAt: string;
    }>;
    [key: string]: any;
  };
}

function transformWishlistItem(item: any): ApiWishlistItem {
  const product = item.productId || item;
  const rawProductId =
    (typeof product === "object" ? product._id : undefined) ||
    (typeof item.productId === "string" ? item.productId : undefined) ||
    "";
  const cleanProductId = rawProductId.replace(/^\/product\//, "");
  return {
    _id: item._id || cleanProductId,
    productId: cleanProductId,
    name: typeof product === "object" ? product.name || "Unknown Product" : item.name || "Unknown Product",
    price: typeof product === "object" ? product.price || 0 : item.price || 0,
    image: getImageUrl(typeof product === "object" ? product.images?.[0] : undefined),
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
