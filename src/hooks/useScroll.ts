import { useState, useEffect, useCallback } from "react";
import { SCROLL_THRESHOLD } from "../lib/constants";

/**
 * Custom hook for detecting scroll position
 * Returns whether the page has been scrolled past a threshold
 * Uses useCallback to memoize the scroll handler
 * 
 * @returns boolean indicating if page is scrolled past threshold
 */
export function useScroll(): boolean {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  /** Memoized scroll handler to prevent recreation on each render */
  const handleScroll = useCallback((): void => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    // Add passive event listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Check initial scroll position
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return isScrolled;
}
