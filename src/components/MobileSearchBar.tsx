import { memo, useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { MobileSearchScreen } from "@/components/MobileSearchScreen";

/**
 * Example queries cycled in the mobile search bar's placeholder. Kept as a
 * module constant (mirroring the data-driven copy in TrendingProducts) so the
 * rotating list can be edited without touching the component body.
 */
const MOBILE_SEARCH_PLACEHOLDERS = [
  "round eyeglasses",
  "kids glasses",
  "sunglasses",
  "screen glasses",
  "blue light glasses",
];

const PLACEHOLDER_ROTATE_MS = 3000;
const PLACEHOLDER_FADE_MS = 300;

/**
 * Mobile-only search entry point rendered directly under the main header row.
 *
 * It is intentionally a button, not an input: tapping it opens the full-screen
 * {@link MobileSearchScreen}, which owns the real input, its autofocus and the
 * search behaviour. Its example text fades to the next query every few seconds,
 * unless the visitor prefers reduced motion.
 */
export const MobileSearchBar = memo(function MobileSearchBar(): JSX.Element {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isPlaceholderFading, setIsPlaceholderFading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useEffect(() => {
    // Respect the visitor's motion preference: keep the first query static.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fadeTimeoutId: number | undefined;
    const rotateIntervalId = window.setInterval(() => {
      setIsPlaceholderFading(true);
      fadeTimeoutId = window.setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % MOBILE_SEARCH_PLACEHOLDERS.length);
        setIsPlaceholderFading(false);
      }, PLACEHOLDER_FADE_MS);
    }, PLACEHOLDER_ROTATE_MS);

    return () => {
      window.clearInterval(rotateIntervalId);
      if (fadeTimeoutId !== undefined) window.clearTimeout(fadeTimeoutId);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search products"
        className="flex h-11 min-h-[44px] w-full items-center gap-2 rounded-full border border-gray-300 bg-white px-4 text-left text-sm text-gray-500 transition-colors hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
      >
        <Search className="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
        <span
          className={`min-w-0 truncate transition-opacity duration-300 ${
            isPlaceholderFading ? "opacity-0" : "opacity-100"
          }`}
        >
          Search "{MOBILE_SEARCH_PLACEHOLDERS[placeholderIndex]}"
        </span>
      </button>

      <MobileSearchScreen isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
});

MobileSearchBar.displayName = "MobileSearchBar";
