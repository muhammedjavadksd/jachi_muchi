import { memo, useState, useRef, useEffect } from "react";
import { SearchIcon } from "../icons";

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSearchOverlay = memo(function MobileSearchOverlay({
  isOpen,
  onClose
}: MobileSearchOverlayProps): JSX.Element {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const popularSearches = [
    "Eyeglasses",
    "Sunglasses", 
    "Round Glasses",
    "Blue Light Glasses",
    "Cat Eye Glasses"
  ];

  return (
    <div className="fixed inset-0 bg-white z-[60] lg:hidden animate-slideDown">
      {/* Search Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2.5">
            <SearchIcon className="flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent outline-none text-base text-gray-900 placeholder-gray-500"
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="text-blue-600 font-medium text-base"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Search Content */}
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-72px)]">
        {/* Recent Searches - show when no query */}
        {!query && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results - show when query exists */}
        {query && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <a
                key={i}
                href={`/search?q=${query}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <SearchIcon className="text-gray-400" />
                <div>
                  <p className="text-gray-900">Sample Result {i} for "{query}"</p>
                  <p className="text-xs text-gray-500">Category &gt; Subcategory</p>
                </div>
              </a>
            ))}
            
            {/* View All Results */}
            <a
              href={`/search?q=${query}`}
              className="flex items-center justify-center gap-2 p-3 mt-4 bg-blue-50 text-blue-600 font-medium rounded-xl hover:bg-blue-100 transition-colors"
            >
              View all results for "{query}"
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
});

MobileSearchOverlay.displayName = "MobileSearchOverlay";
