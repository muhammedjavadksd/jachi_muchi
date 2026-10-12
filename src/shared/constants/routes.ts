/**
 * Canonical paths that must stay in sync between a link and its route.
 *
 * BUG-024: every "Locate Us" entry point used to type its own path string
 * literal — header pill, footer link, mobile bottom nav, home cards, contact
 * page, and the router registration itself. Because the path was duplicated in
 * eight places it silently drifted: the contact page linked to
 * `/search?type=stores`, which is the Products listing route, so "Locate a
 * nearby store" opened the Products page. `SearchPage` never reads a `type`
 * query param, so the store intent was discarded and the products grid was
 * rendered instead.
 *
 * BUG-023: the same class of failure hit the footer's "Disclaimer" link. It
 * pointed at `/disclaimer` from two places (the Legal column and the mobile
 * bottom bar) while no such route was ever registered, so the path fell through
 * to the `*` catch-all and rendered the 404 page. Two link definitions and zero
 * route registrations is the same duplication failure, so legal paths are
 * declared here too.
 *
 * A path that must stay in sync between a link and its route is therefore
 * declared exactly once, here, and both the link definitions and the route
 * table in `app/routes/index.tsx` read from this object. `ROUTE_PATHS` is
 * `as const` so a typo is a compile error, not a 404 at runtime.
 */
export const ROUTE_PATHS = {
  /**
   * The store-locator page: the full branch list with address, opening hours,
   * phone, per-store "Get Directions" map links and nearest-store geolocation.
   * This is the canonical "Locate Us" destination and the one every link in the
   * app (header, footer, mobile bottom nav, home, contact) must use.
   */
  storeLocator: "/stores",
  /**
   * Geolocation-first variant of the same feature: asks the browser for
   * coordinates, then highlights the closest branch. Reached from the home
   * "Find Nearest Store" highlight only, so it is kept separate from
   * {@link ROUTE_PATHS.storeLocator} rather than replacing it.
   */
  findNearestStore: "/find-nearest-store",
  /**
   * BUG-023: the footer's "Disclaimer" link, in both the Legal column and the
   * mobile bottom bar. Routed to `DisclaimerPage` in `app/routes/index.tsx`.
   */
  disclaimer: "/disclaimer",
  /**
   * The remaining footer Legal links, declared here alongside
   * {@link ROUTE_PATHS.disclaimer} so the whole group is covered by one object.
   * These paths were already correct — they are constants purely so a future
   * edit cannot introduce the same link/route drift that caused BUG-023, and so
   * the Legal column and the mobile bottom bar cannot disagree with each other.
   */
  terms: "/terms",
  privacy: "/privacy",
  refundPolicy: "/refund-policy",
  shippingPolicy: "/shipping-policy",
  /**
   * BUG-028: the footer's "Frame Size" guide (Services column). Like
   * `disclaimer`, it was a bare string literal with no matching route, so the
   * click fell through to the `*` catch-all and rendered the 404 page.
   * Routed to `FrameSizeGuidePage` in `app/routes/index.tsx`.
   */
  frameSizeGuide: "/frame-size",
  /**
   * BUG-029: the footer's "Buying Guide" (Services column) — the third link in
   * this family that was a bare literal with no registered route. Routed to
   * `BuyingGuidePage` in `app/routes/index.tsx`.
   */
  buyingGuide: "/buying-guide",
  /**
   * Referenced from the Buying Guide for the warranty section, and registered
   * in the route table, so it is declared here for the same reason as the rest.
   */
  warranty: "/warranty",
} as const;

/**
 * The store locator filtered to branches offering a given service, e.g.
 * `storeLocatorWithService("free-eye-testing")` -> `/stores?service=...`.
 * `StoresPage` reads the `service` query param, so the query string is part of
 * the contract and must be built here rather than inlined at each call site.
 */
export const storeLocatorWithService = (service: string): string =>
  `${ROUTE_PATHS.storeLocator}?service=${encodeURIComponent(service)}`;
