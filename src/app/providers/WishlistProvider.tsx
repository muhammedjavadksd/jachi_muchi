import { createContext, useCallback, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { WishlistItem } from "@/features/wishlist/types";

interface WishlistContextValue {
  items: WishlistItem[];
  isOpen: boolean;
  loading: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  isInWishlist: (link: string) => boolean;
  setItems: Dispatch<SetStateAction<WishlistItem[]>>;
  setLoading: (loading: boolean) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const isInWishlist = useCallback(
    (link: string) => items.some((i) => i.link === link),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      loading,
      open,
      close,
      toggle,
      isInWishlist,
      setItems,
      setLoading,
    }),
    [items, isOpen, loading, open, close, toggle, isInWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export { WishlistContext };
