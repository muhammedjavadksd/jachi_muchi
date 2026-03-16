import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { WishlistItem } from "../types";

const DEMO_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: "/product/1",
    name: "Classic Aviator Sunglasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop",
    link: "/product/1",
    price: 1999,
  },
  {
    id: "/product/2",
    name: "Blue Light Blocking Eyeglasses",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=200&fit=crop",
    link: "/product/2",
    price: 2499,
  },
  {
    id: "/product/3",
    name: "Round Metal Frame Glasses",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=200&h=200&fit=crop",
    link: "/product/3",
    price: 1799,
  },
];

interface WishlistContextValue {
  items: WishlistItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (item: Omit<WishlistItem, "id">) => void;
  removeItem: (id: string) => void;
  isInWishlist: (link: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [items, setItems] = useState<WishlistItem[]>(DEMO_WISHLIST_ITEMS);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback((item: Omit<WishlistItem, "id">) => {
    const id = item.link;
    setItems((prev) => {
      if (prev.some((i) => i.id === id)) return prev;
      return [...prev, { ...item, id }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

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
    }),
    [items, isOpen, open, close, toggle, addItem, removeItem, isInWishlist]
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
