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
  // Google Ads landing page. It ships its own fixed bottom CTA bar
  // (Call / WhatsApp / Get Directions); the app bottom nav would sit on top of
  // it and neither belongs on an ad landing page.
  "/moi-approved-eye-test-qatar",
];