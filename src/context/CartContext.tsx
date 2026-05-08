import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

export interface CartItem {
  cartItemId?: string;
  productId: string;
  productName: string;
  productPrice: number;
  mrp?: number;
  quantity?: number;
  color: { name: string; id: string } | null;
  lens: {
    id?: string;
    name: string;
    price: number;
  } | null;
  lensPrice?: number;
  totalPrice: number;
  powerType?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  itemCount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(stored)) {
      setItems(stored);
    }
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const updated = [...prev, item];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.cartItemId !== cartItemId);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("cart");
  }, []);

  const itemCount = useMemo(() => items.length, [items]);

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    itemCount,
    clearCart,
  }), [items, addItem, removeItem, itemCount, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
