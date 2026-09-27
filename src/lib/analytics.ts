/**
 * Google Analytics 4 tracking helpers.
 *
 * Analytics is delivered by the static `gtag.js` snippet in `index.html`,
 * which already loads the shared `window.dataLayer` / `window.gtag` runtime for
 * Google Tag Manager and the Google Ads tag. These helpers only push onto that
 * existing runtime — no second loader, no additional network request, and no
 * third-party analytics dependency.
 *
 * Every helper is defensive: if the snippet has not run (or was blocked by an
 * extension or CSP), `window.gtag` is not a function and the call is a no-op so
 * navigation and rendering are never interrupted.
 */

/** GA4 measurement (property) ID for this storefront. */
export const GA_MEASUREMENT_ID = "G-XQBRYBDW88";

/** True when the `gtag.js` runtime is present and callable on the page. */
function isGtagAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/**
 * Reports a page view for the given path.
 *
 * Re-sends the GA4 config with an explicit `page_path` so the reported path
 * matches the client-side route rather than the document path that was loaded.
 * No-op when `gtag` is unavailable.
 */
export function trackPageView(path: string): void {
  if (!isGtagAvailable()) return;

  window.gtag("config", GA_MEASUREMENT_ID, { page_path: path });
}

/**
 * Reports a named analytics event with optional parameters.
 * No-op when `gtag` is unavailable.
 */
export function trackEvent(action: string, params?: Record<string, any>): void {
  if (!isGtagAvailable()) return;

  window.gtag("event", action, params);
}
