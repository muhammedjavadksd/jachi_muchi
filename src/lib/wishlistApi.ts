import axiosInstance from "@/cors/axiosInstance";
import type {
  ApiWishlistItem,
  AddToWishlistRequest,
} from "../types";

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

/**
 * Transform backend wishlist item to frontend format
 */
function transformWishlistItem(item: any): ApiWishlistItem {
  const product = item.productId || item;
  return {
    _id: item._id || product._id,
    productId: product._id || item.productId,
    name: product.name || "Unknown Product",
    price: product.price || 0,
    image: product.images?.[0] || "/placeholder-product.png",
    link: `/product/${product._id || item.productId}`,
    addedAt: item.addedAt || new Date().toISOString(),
  };
}

/**
 * Fetch wishlist items from backend
 * Uses axiosInstance which automatically attaches auth token via interceptor
 */
export async function fetchWishlist(): Promise<ApiWishlistItem[]> {
  try {
    const response = await axiosInstance.get<WishlistApiResponse>("/wishlist");
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

/**
 * Add item to wishlist
 * Uses axiosInstance which automatically attaches auth token via interceptor
 */
export async function addToWishlistAPI(
  item: AddToWishlistRequest
): Promise<ApiWishlistItem> {
  try {
    const response = await axiosInstance.post<AddToWishlistApiResponse>("/wishlist/add", item);

    const wishlistData = response.data.data;
    if (!wishlistData?.items?.length) {
      throw new Error("Invalid response from server");
    }

    // Return the newly added item (last item in the array)
    const lastItem = wishlistData.items[wishlistData.items.length - 1];
    return transformWishlistItem(lastItem);
  } catch (error: any) {
    console.error("addToWishlistAPI error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add item to wishlist");
  }
}

/**
 * Remove item from wishlist
 * Uses axiosInstance which automatically attaches auth token via interceptor
 */
export async function removeFromWishlistAPI(
  productId: string
): Promise<void> {
  try {
    await axiosInstance.delete(`/wishlist/remove/${productId}`);
  } catch (error: any) {
    console.error("removeFromWishlistAPI error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to remove item from wishlist");
  }
}

/**
 * Check if item is in wishlist
 * Uses axiosInstance which automatically attaches auth token via interceptor
 */
export async function checkWishlistItem(
  productId: string
): Promise<boolean> {
  try {
    const response = await axiosInstance.get(`/wishlist/check/${productId}`);
    return response.data.data?.isInWishlist || false;
  } catch {
    return false;
  }
}
