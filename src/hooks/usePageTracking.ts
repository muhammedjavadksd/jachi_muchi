import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/**
 * Reports a GA4 page view on every client-side route change.
 *
 * Mounted once, above the router outlet, so it observes `useLocation()` for the
 * whole app. Mirrors the `ScrollToTop` pattern: read the location, react to it
 * in an effect.
 *
 * The initial mount is skipped because `index.html` already fires a page view
 * via `gtag('config', 'G-XQBRYBDW88')` on document load; firing again would
 * double-count the entry page. The first *navigation* after mount is reported
 * normally.
 */
export function usePageTracking(): void {
  const { pathname, search } = useLocation();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    trackPageView(pathname + search);
  }, [pathname, search]);
}
