import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchCart,
  addToCartApi,
  updateCartItemQuantity,
  removeCartItemApi,
  clearCartApi,
  mapBackendItem,
  type BackendCartResponse,
} from "@/features/cart/api/cartApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { OrderItemVariant } from "@/shared/utils/variant";

export interface CartItem {
  cartItemId?: string;
  bogoGroupId?: string;
  productId: string;
  variantId?: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  mrp?: number;
  quantity?: number;
  color: { name: string; id: string } | null;
  variant?: OrderItemVariant | null;
  brand: { id?: string; name: string; logo?: string } | null;
  lens: { id?: string; name: string; price: number; discount?: number } | null;
  lensPrice?: number;
  transition: {
    transitionId: string;
    name: string;
    color: string;
  } | null;
  transitionPrice?: number;
  totalPrice: number;
  powerType?: string;
  powerDetails?: object | null;
  isFree?: boolean;
  freeCount?: number;
  freeUnitPrice?: number;
  setCount?: number;
  isFreeOfferItem?: boolean;
  triggerProductName?: string;
}

/** What the add-to-cart endpoints accept, re-exported so callers need no api import. */
export interface AddToCartPayload {
  productId: string;
  quantity?: number;
  color?: { name: string; id: string } | null;
  brand?: { id: string; name: string } | null;
  lens?: { id: string; name: string; price: number; discount?: number } | null;
  transition?: { transitionId: string; color: string } | null;
  powerType?: string | null;
  powerDetails?: object | null;
  bogoGroupId?: string | null;
  isFree?: boolean;
}

interface CartContextValue {
  items: CartItem[];
  /** Raw bill from the server, so the cart page can render the same figures. */
  bill: Record<string, any> | null;
  total: number;
  /**
   * Single source of truth for the cart badge. Always the sum of item
   * quantities - CartPage reads this instead of deriving a second count.
   */
  itemCount: number;
  loading: boolean;
  /**
   * Set when the last load failed. Distinct from an empty cart: the provider
   * keeps the last confirmed items rather than blanking to 0, so the badge can
   * never show a wrong number because of a dropped request.
   */
  loadError: string | null;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  updateQuantity: (cartItemId: string, action: "increment" | "decrement") => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  reload: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Fixed id so a repeated failure updates one toast instead of stacking. */
const CART_LOAD_ERROR_TOAST_ID = "cart-load-error";

/**
 * BUG-012 — the owner of all cart state.
 *
 * The header badge and the cart page previously each kept their own copy of the
 * cart, and the badge's copy was refreshed by a global "something changed" event
 * that triggered another GET /cart after a write that had already returned the
 * new cart. That made the badge depend on a second round-trip it did not need,
 * left it stale after login (there was no reload on auth change, so a guest cart
 * merged on the server only appeared after a full refresh), and let the badge and
 * the cart page disagree, because they summed different fields.
 *
 * Now every mutation funnels through here, and each one applies the response the
 * server already returned via applyCart - no refetch, no race. The event channel
 * this replaced is gone rather than kept alongside, so there is no second path
 * that can leave the badge stale.
 *
 * Loading is keyed on isAuthenticated, so a cart that belongs to the session is
 * (re)read on login and dropped on logout without needing a page refresh.
 */
export function CartProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [items, setItems] = useState<CartItem[]>([]);
  const [bill, setBill] = useState<Record<string, any> | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAuthenticatedRef = useRef(isAuthenticated);
  isAuthenticatedRef.current = isAuthenticated;

  /**
   * BUG-014: identifies the newest in-flight load. Responses for a superseded
   * request are dropped, so a slow reply for user A cannot land after a fast one
   * for user B (sign out -> sign in, or a StrictMode double-mount) and repaint
   * the badge with the previous session's cart.
   */
  const requestIdRef = useRef(0);

  const applyCart = useCallback((cart: BackendCartResponse | null) => {
    if (!cart) {
      setItems([]);
      setBill(null);
      setTotal(0);
      return;
    }
    setItems(cart.items.map(mapBackendItem));
    setBill(cart.bill ?? null);
    setTotal(Number(cart.total) || 0);
  }, []);

  const loadCart = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    // Signed out there is no server cart (this app has no guest cart), so skip
    // the request instead of letting its 401 reset state the provider holds.
    // Bumping requestId above also retires any in-flight response from the
    // session that is being torn down.
    if (!isAuthenticatedRef.current) {
      applyCart(null);
      setLoading(false);
      setLoadError(null);
      return;
    }

    setLoading(true);
    try {
      const cart = await fetchCart();
      if (requestId !== requestIdRef.current) return;
      applyCart(cart);
      setLoadError(null);
    } catch (error: any) {
      if (requestId !== requestIdRef.current) return;
      // Deliberately does NOT applyCart(null): an empty cart and a failed load
      // are different states, and collapsing them is what made a dropped
      // request render as a confident "0 items". The last confirmed cart stays.
      setLoadError(
        error?.response?.data?.message || "We couldn't load your cart."
      );
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [applyCart]);

  useEffect(() => {
    // Wait for AuthProvider's bootstrap /me check to settle first: acting while
    // it is still in flight would read the placeholder `false` and briefly
    // report an empty cart. The auth dependency re-runs this as soon as the
    // real value lands, and on every later login/logout.
    if (isAuthLoading) return;
    loadCart();
  }, [loadCart, isAuthenticated, isAuthLoading]);

  // Surfaced once per distinct failure, with a retry, instead of silently
  // leaving a wrong-looking count on the badge. toast.custom is used because
  // react-hot-toast 2.6 has no `action` option on ToastOptions.
  useEffect(() => {
    if (!loadError) {
      toast.dismiss(CART_LOAD_ERROR_TOAST_ID);
      return;
    }
    toast.custom(
      (renderable) => (
        <div className="flex max-w-sm items-center gap-3 rounded-lg bg-zinc-900 px-4 py-3 text-sm text-white shadow-lg">
          <span className="flex-1 leading-snug">{loadError}</span>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(renderable.id);
              setLoadError(null);
              void loadCart();
            }}
            className="shrink-0 rounded-md bg-white/15 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Retry
          </button>
        </div>
      ),
      { id: CART_LOAD_ERROR_TOAST_ID, duration: 8000 }
    );
  }, [loadError, loadCart]);

  const requireLogin = useCallback((): boolean => {
    if (isAuthenticatedRef.current) return true;
    window.dispatchEvent(new Event("auth:require-login"));
    return false;
  }, []);

  // A successful write is proof the session and cart are reachable again.
  const confirmCart = useCallback(
    (cart: BackendCartResponse | null) => {
      // Retires any in-flight load, but that load skips its own setLoading(false)
      // (it is no longer the newest request), so the pending flag is cleared here.
      requestIdRef.current += 1;
      applyCart(cart);
      setLoadError(null);
      setLoading(false);
    },
    [applyCart]
  );

  const addToCart = useCallback(
    async (payload: AddToCartPayload) => {
      if (!requireLogin()) return;
      // Rejections propagate so the caller can surface a toast and leave the
      // badge on the last confirmed state.
      confirmCart(await addToCartApi(payload));
    },
    [confirmCart, requireLogin]
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, action: "increment" | "decrement") => {
      if (!requireLogin()) return;
      confirmCart(await updateCartItemQuantity(cartItemId, action));
    },
    [confirmCart, requireLogin]
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      if (!requireLogin()) return;
      confirmCart(await removeCartItemApi(cartItemId));
    },
    [confirmCart, requireLogin]
  );

  const clearCart = useCallback(async () => {
    if (!requireLogin()) return;
    await clearCartApi();
    // DELETE /cart returns no body, so the emptied state is applied directly.
    confirmCart(null);
  }, [confirmCart, requireLogin]);

  // The one and only count: total quantity across the cart. The cart page
  // consumes this instead of summing setCount on its own, which is how the two
  // used to disagree for BOGO/set items.
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      bill,
      total,
      itemCount,
      loading,
      loadError,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      reload: loadCart,
    }),
    [items, bill, total, itemCount, loading, loadError, addToCart, updateQuantity, removeItem, clearCart, loadCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
