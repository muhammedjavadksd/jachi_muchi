import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { WishlistItem } from "../types";
import { fetchWishlist, addToWishlistAPI, removeFromWishlistAPI } from "../lib/wishlistApi";
import { useAuth } from "./AuthContext";
import type { ApiWishlistItem } from "../types";

interface WishlistContextValue {
  items: WishlistItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (item: Omit<WishlistItem, "id">) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isInWishlist: (link: string) => boolean;
  loading: boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const apiItems: ApiWishlistItem[] = await fetchWishlist();
      const wishlistItems: WishlistItem[] = apiItems.map((item) => ({
        id: item.productId || item._id || "",
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
  }, [isAuthenticated]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback(async (item: Omit<WishlistItem, "id">) => {
    if (!isAuthenticated) {
      console.warn("User must be logged in to add to wishlist");
      return;
    }
    try {
      const apiItem = await addToWishlistAPI({
        productId: item.link,
        name: item.name,
        image: item.image,
        link: item.link,
        price: item.price,
      });
      const newItem: WishlistItem = {
        id: apiItem.productId || apiItem._id || item.link,
        name: apiItem.name,
        image: apiItem.image,
        link: apiItem.link,
        price: apiItem.price,
      };
      setItems((prev) => {
        if (prev.some((i) => i.id === newItem.id)) return prev;
        return [...prev, newItem];
      });
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  }, [isAuthenticated]);

  const removeItem = useCallback(async (id: string) => {
    if (!isAuthenticated) return;
    try {
      await removeFromWishlistAPI(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  }, [isAuthenticated]);

  const isInWishlist = useCallback(
    (link: string) => items.some((i) => i.link === link),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      open,
      close,
      toggle,
      addItem,
      removeItem,
      isInWishlist,
      loading,
      refreshWishlist: loadWishlist,
    }),
    [items, isOpen, open, close, toggle, addItem, removeItem, isInWishlist, loading, loadWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
