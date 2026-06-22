import { memo, useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { searchSuggestions } from "@/features/product/api/searchApi";
import type { SearchResult } from "@/features/product/types";

interface SearchAutocompleteProps {
  variant?: "light" | "dark";
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchAutocomplete = memo(function SearchAutocomplete({
  variant = "light",
  placeholder = "Search for glasses, frames & more",
  onSearch,
}: SearchAutocompleteProps): JSX.Element {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      setHasSearched(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchSuggestions(debouncedQuery).then((data) => {
      if (!cancelled) {
        setResults(data);
        setHasSearched(true);
        setLoading(false);
        setHighlightedIndex(-1);
      }
    });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = focused && query.trim().length > 0;

  const allItems = useMemo(() => {
    const items: { type: "suggestion" | "category"; label: string }[] = [];
    if (results) {
      results.suggestions.forEach((s) => items.push({ type: "suggestion", label: s }));
      results.categories.forEach((c) => items.push({ type: "category", label: c }));
    }
    return items;
  }, [results]);

  const triggerSearch = useCallback(
    (q: string) => {
      setFocused(false);
      setQuery(q);
      if (onSearch) onSearch(q);
      navigate(`/search?q=${encodeURIComponent(q)}`);
    },
    [navigate, onSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < allItems.length) {
          triggerSearch(allItems[highlightedIndex].label);
        } else if (query.trim()) {
          triggerSearch(query.trim());
        }
      } else if (e.key === "Escape") {
        setFocused(false);
      }
    },
    [allItems, highlightedIndex, query, triggerSearch]
  );

  const bgClass = variant === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const inputBg = variant === "dark" ? "bg-gray-700 text-white placeholder:text-gray-400" : "bg-gray-100 text-gray-900 placeholder:text-gray-500";

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className={`flex items-center rounded-full ${inputBg}`}>
        <svg className={`w-5 h-5 ml-4 shrink-0 ${variant === "dark" ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-3 py-2.5 text-sm outline-none ${inputBg} rounded-full`}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults(null); setHasSearched(false); }}
            className="mr-2 p-1 rounded-full hover:bg-black/10"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl border ${variant === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} z-50 overflow-hidden`}>
          {loading && (
            <div className="flex items-center gap-3 px-5 py-4">
              <svg className="animate-spin h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm text-gray-500">Searching...</span>
            </div>
          )}

          {!loading && hasSearched && (!results || (results.suggestions.length === 0 && results.categories.length === 0)) && (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-gray-500">No results found</p>
            </div>
          )}

          {!loading && results && results.suggestions.length > 0 && (
            <div className="py-2">
              <p className={`px-5 py-1.5 text-xs font-semibold uppercase tracking-wider ${variant === "dark" ? "text-gray-400" : "text-gray-500"}`}>Suggestions</p>
              {results.suggestions.map((s, i) => {
                const idx = allItems.indexOf(allItems.find((x) => x.type === "suggestion" && x.label === s)!);
                return (
                  <button
                    key={s}
                    onClick={() => triggerSearch(s)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors ${
                      highlightedIndex === idx ? (variant === "dark" ? "bg-gray-700" : "bg-gray-100") : ""
                    } ${variant === "dark" ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    {s}
                  </button>
                );
              })}
            </div>
          )}

          {!loading && results && results.categories.length > 0 && (
            <div className={`py-2 border-t ${variant === "dark" ? "border-gray-700" : "border-gray-100"}`}>
              <p className={`px-5 py-1.5 text-xs font-semibold uppercase tracking-wider ${variant === "dark" ? "text-gray-400" : "text-gray-500"}`}>Categories</p>
              {results.categories.map((c) => {
                const idx = allItems.indexOf(allItems.find((x) => x.type === "category" && x.label === c)!);
                return (
                  <button
                    key={c}
                    onClick={() => triggerSearch(c)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors ${
                      highlightedIndex === idx ? (variant === "dark" ? "bg-gray-700" : "bg-gray-100") : ""
                    } ${variant === "dark" ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    {c}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

SearchAutocomplete.displayName = "SearchAutocomplete";
