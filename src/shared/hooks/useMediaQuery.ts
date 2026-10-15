import { useEffect, useState } from "react";

/**
 * Tracks whether the viewport currently matches a CSS media query.
 *
 * Used for conditional rendering decisions that must remove elements from the
 * DOM (rather than hide them with CSS), e.g. the mobile-only category cards on
 * the home page. Subscribes to the query's `change` event so the result updates
 * live on resize without a page refresh.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
