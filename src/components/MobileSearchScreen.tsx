import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpLeft, Search, X } from "lucide-react";
import { SearchSuggestionList } from "@/components/SearchSuggestionList";
import { useSearchSuggestions } from "@/features/product/hooks";

/**
 * Curated "Trending searches" rows shown before anything is typed. Terms map to
 * the storefront's existing category images under `public/category`; a row whose
 * image is absent falls back to a neutral grey tile with the search icon.
 */
const TRENDING_SEARCHES = [
  { term: "eyeglasses", image: "/category/unisex.png" },
  { term: "sunglasses", image: "/category/silver.png" },
  { term: "kids glasses", image: "/category/kids.png" },
  { term: "screen glasses", image: "/category/ZeroPowerComputer.png" },
  { term: "blue light glasses", image: "/category/professional.png" },
  { term: "round frames", image: "/category/FrameOnly.png" },
];

export interface MobileSearchScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-screen, mobile-only search surface opened by {@link MobileSearchBar}.
 *
 * It reuses the header's search behaviour (navigate to `/search?q=…`) rather
 * than adding a second search path, and restyles only the mobile presentation.
 * Live phrases come from the shared {@link useSearchSuggestions} hook and render
 * through the shared {@link SearchSuggestionList}, exactly like the desktop
 * dropdown. The desktop header overlay is untouched.
 */
export const MobileSearchScreen = memo(function MobileSearchScreen({
  isOpen,
  onClose,
}: MobileSearchScreenProps): JSX.Element | null {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const trimmedQuery = query.trim();
  const { phrases, loading } = useSearchSuggestions(trimmedQuery);

  const runSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setQuery("");
      onClose();
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [navigate, onClose]
  );

  // Arrow tap: copy the phrase into the input and keep the screen (and
  // keyboard) open so the shopper can refine it.
  const handleCopyPhrase = useCallback((phrase: string) => {
    setQuery(phrase);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Autofocus so the keyboard opens, and lock body scroll while the screen is up.
  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Close on the Escape key, matching the header overlay's own handling.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Start from a clean slate the next time the screen opens.
  useEffect(() => {
    if (isOpen) return;
    setQuery("");
    setActiveIndex(-1);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    runSearch(query);
  };

  const showTrending = trimmedQuery === "";
  const showEmpty = !showTrending && !loading && phrases.length === 0;

  // Portalled to <body> so the equal-z fixed siblings that render after the
  // header (e.g. BottomNav, also z-50) cannot paint over this full-screen
  // surface. It still lives in the React tree, so state and handlers are intact.
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="sticky top-0 z-10 flex items-center gap-1 bg-white px-4 pt-3 pb-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Go back"
          className="shrink-0 rounded-full p-2 text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
            }}
            placeholder='Search "round eyeglasses"'
            aria-label="Search products"
            className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query !== "" && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveIndex(-1);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {showTrending ? (
        <div className="pb-6">
          <p className="px-4 pt-6 pb-2 text-xs uppercase tracking-wide text-gray-500">
            Trending searches
          </p>
          <ul>
            {TRENDING_SEARCHES.map((item) => (
              <TrendingSearchRow
                key={item.term}
                term={item.term}
                image={item.image}
                onSearch={runSearch}
                onCopy={setQuery}
              />
            ))}
          </ul>
        </div>
      ) : phrases.length > 0 ? (
        <SearchSuggestionList
          query={trimmedQuery}
          phrases={phrases}
          activeIndex={activeIndex}
          onSelect={runSearch}
          onHoverIndex={setActiveIndex}
          onCopy={handleCopyPhrase}
        />
      ) : showEmpty ? (
        <div className="flex flex-col items-center gap-4 px-6 pt-12 text-center">
          <p className="text-sm text-gray-500">
            No results for &quot;{trimmedQuery}&quot;
          </p>
          <button
            type="button"
            onClick={() => runSearch(trimmedQuery)}
            className="rounded-full bg-teal px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            Search anyway
          </button>
        </div>
      ) : null}
    </div>,
    document.body
  );
});

MobileSearchScreen.displayName = "MobileSearchScreen";

const TrendingSearchRow = memo(function TrendingSearchRow({
  term,
  image,
  onSearch,
  onCopy,
}: {
  term: string;
  image: string;
  onSearch: (term: string) => void;
  onCopy: (term: string) => void;
}): JSX.Element {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <li className="flex items-center border-b border-gray-100">
      <button
        type="button"
        onClick={() => onSearch(term)}
        className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 pr-2 text-left focus-visible:outline-none focus-visible:bg-gray-50"
      >
        {imageFailed ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
            <Search className="h-5 w-5" />
          </span>
        ) : (
          <img
            src={image}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 object-cover"
          />
        )}
        <span className="min-w-0 flex-1 truncate text-sm text-gray-900">{term}</span>
      </button>
      <button
        type="button"
        onClick={() => onCopy(term)}
        aria-label={`Edit search for ${term}`}
        className="shrink-0 rounded-full p-2 pr-4 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        <ArrowUpLeft className="h-5 w-5" />
      </button>
    </li>
  );
});

TrendingSearchRow.displayName = "TrendingSearchRow";
