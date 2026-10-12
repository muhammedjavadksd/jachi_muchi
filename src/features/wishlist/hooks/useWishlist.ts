import { useCallback, useContext, useEffect, useRef } from "react";
import { WishlistContext } from "@/app/providers/WishlistProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchWishlist, addToWishlistAPI, removeFromWishlistAPI } from "@/features/wishlist/api/wishlistApi";
import type { WishlistItem, ApiWishlistItem } from "@/features/wishlist/types";

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");

  const { items, isOpen, loading, open, close, toggle, isInWishlist, setItems, setLoading } = context;
  const { isAuthenticated } = useAuth();

  /**
   * BUG-014: the wishlist badge showed a stale count after login for the same
   * reason the cart badge did - a slow response for the previous session could
   * land after a newer one and repaint the list with the wrong user's items.
   * Tagging each load and dropping superseded replies removes that.
   */
  const requestIdRef = useRef(0);

  const refreshWishlist = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const apiItems: ApiWishlistItem[] = await fetchWishlist();
      if (requestId !== requestIdRef.current) return;
      const wishlistItems: WishlistItem[] = apiItems.map((item) => ({
        id: (item.productId || item._id || "").replace(/^\/product\//, ""),
        name: item.name,
        image: item.image,
        link: item.link,
        price: item.price,
      }));
      setItems(wishlistItems);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error("Failed to load wishlist:", error);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [isAuthenticated, setItems, setLoading]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  /**
   * Adds a product to the wishlist, then reconciles the shared list from the
   * server so every consumer (wishlist page, WishlistCanvas, header badge)
   * updates at once without each needing a refetch of its own.
   *
   * The refetch is not redundant. `POST /wishlist/add` replies with the whole
   * wishlist document, but addToWishlistAPI surfaces only its last entry — and
   * when the product is already saved the server may append nothing, making
   * that "last entry" an unrelated product. Re-reading the list is what keeps
   * an existing item from being duplicated or replaced by the wrong one.
   *
   * Rejects on failure so callers can leave their own state untouched: the
   * cart's "Move to wishlist" depends on this to keep the item in the cart.
   */
  const addItem = useCallback(async (item: Omit<WishlistItem, "id">) => {
    if (!isAuthenticated) {
      window.dispatchEvent(new Event("auth:require-login"));
      throw new Error("Sign in to save items to your wishlist.");
    }
    const productId = item.link.replace(/^\/product\//, "");
    try {
      await addToWishlistAPI({
        productId,
        name: item.name,
        image: item.image,
        link: item.link,
        price: item.price,
      });
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      throw error;
    }
    await refreshWishlist();
  }, [isAuthenticated, refreshWishlist]);

  const removeItem = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      window.dispatchEvent(new Event("auth:require-login"));
      return;
    }
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
