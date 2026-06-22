import { useCallback, useContext, useEffect } from "react";
import { WishlistContext } from "@/app/providers/WishlistProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchWishlist, addToWishlistAPI, removeFromWishlistAPI } from "@/features/wishlist/api/wishlistApi";
import type { WishlistItem, ApiWishlistItem } from "@/features/wishlist/types";

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");

  const { items, isOpen, loading, open, close, toggle, isInWishlist, setItems, setLoading } = context;
  const { isAuthenticated } = useAuth();

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const apiItems: ApiWishlistItem[] = await fetchWishlist();
      const wishlistItems: WishlistItem[] = apiItems.map((item) => ({
        id: (item.productId || item._id || "").replace(/^\/product\//, ""),
        name: item.name,
        image: item.image,
        link: item.link,
        price: item.price,
      }));
      setItems(wishlistItems);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, setItems, setLoading]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const addItem = useCallback(async (item: Omit<WishlistItem, "id">) => {
    if (!isAuthenticated) {
      console.warn("User must be logged in to add to wishlist");
      return;
    }
    try {
      const productId = item.link.replace(/^\/product\//, "");
      const apiItem = await addToWishlistAPI({
        productId,
        name: item.name,
        image: item.image,
        link: item.link,
        price: item.price,
      });
      const newItem: WishlistItem = {
        id: apiItem.productId || apiItem._id || productId,
        name: apiItem.name,
        image: apiItem.image,
        link: apiItem.link,
        price: apiItem.price,
      };
      setItems((prev: WishlistItem[]) => {
        if (prev.some((i) => i.id === newItem.id)) return prev;
        return [...prev, newItem];
      });
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  }, [isAuthenticated, setItems]);

  const removeItem = useCallback(async (id: string) => {
    if (!isAuthenticated) return;
    try {
      await removeFromWishlistAPI(id);
      setItems((prev: WishlistItem[]) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  }, [isAuthenticated, setItems]);

  return {
    items,
    isOpen,
    open,
    close,
    toggle,
    addItem,
    removeItem,
    isInWishlist,
    loading,
    refreshWishlist,
  };
}
