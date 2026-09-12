import type { NavTab } from "./BottomNav";

export const BOTTOM_NAV_ROUTES: Record<NavTab, string> = {
  home: "/",
  stores: "/stores",
  // "ar-tryon": "/try-at-home", // AR Try on — temporarily hidden
  "eye-test": "/online-eye-test",
  orders: "/account/orders",
  wishlist: "/wishlist",
};

export const BOTTOM_NAV_EXCLUDED_PREFIXES: readonly string[] = [
  "/checkout",
  "/order-success",
  "/order-failure",
  "/payment",
  "/online-eye-test",
];