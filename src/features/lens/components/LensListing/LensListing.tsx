import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { EmptyState, Pagination } from "@/shared/components";
import { LensCard } from "@/features/lens/components/LensCard/LensCard";
import { LensSortControl } from "@/features/lens/components/LensSortControl/LensSortControl";
import {
  LENS_BREADCRUMB_LINKS,
  LENS_GRID_SKELETON_COUNT,
} from "@/features/lens/constants";
import type { LensItem } from "@/features/lens/types";

export interface LensListingProps {
  lenses: LensItem[];
  title: string;
  total: number;
  loading: boolean;
  fetching: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  onToggleFilters?: () => void;
}

const GRID_CLASSES =
  "grid grid-cols-2 gap-3 min-[900px]:grid-cols-3 min-[1200px]:grid-cols-4";

function LensGridSkeleton(): JSX.Element {
  return (
    <div className={GRID_CLASSES} aria-hidden>
      {Array.from({ length: LENS_GRID_SKELETON_COUNT }).map((_, index) => (
        <div key={index} className="border border-[#e8e8e8] bg-white">
          <div className="aspect-square animate-pulse bg-[#f6f6f6]" />
          <div className="px-[21px] py-5">
            <div className="h-3 w-16 animate-pulse bg-gray-200" />
            <div className="mt-2 h-5 w-3/4 animate-pulse bg-gray-200" />
            <div className="mt-3 h-4 w-1/2 animate-pulse bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full-width lens listing layout used by the lens mode of SearchPage.
 * Renders the serif title/count/breadcrumb header, the plain-text sort
 * control, and the responsive 2/3/4-column card grid. Frame listing UI is
 * intentionally untouched and still renders through ProductGrid.
 */
export const LensListing = memo(function LensListing({
  lenses,
  title,
  total,
  loading,
  fetching,
  page,
  totalPages,
  onPageChange,
  sortBy,
  onSortChange,
  onToggleFilters,
}: LensListingProps): JSX.Element {
  const handlePageChange = useCallback(
    (nextPage: number) => {
      onPageChange(nextPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [onPageChange]
  );

  // The all-lenses page is titled "Lenses" and already includes it as the
  // breadcrumb's parent, so do not repeat it as the current crumb.
  const showCurrentCrumb = useMemo(() => {
    const lastLink = LENS_BREADCRUMB_LINKS[LENS_BREADCRUMB_LINKS.length - 1];
    return lastLink?.label.trim().toLowerCase() !== title.trim().toLowerCase();
  }, [title]);

  return (
    <section className="pb-16 pt-6" aria-label={`${title} lenses`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1
              className="font-brand font-bold text-[#1a1a1a]"
              style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.05 }}
            >
              {title}
            </h1>
            <span className="text-[13px] text-gray-500">{total} Items</span>
          </div>

          <nav aria-label="Breadcrumb" className="mt-2">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              {LENS_BREADCRUMB_LINKS.map((link, index) => (
                <li key={link.to} className="flex items-center gap-1.5">
                  <Link
                    to={link.to}
                    className="outline-none transition-colors hover:text-[#1a1a1a] focus-visible:ring-2 focus-visible:ring-[#b8860b] focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                  {(index < LENS_BREADCRUMB_LINKS.length - 1 || showCurrentCrumb) && (
                    <span aria-hidden>/</span>
                  )}
                </li>
              ))}
              {showCurrentCrumb && (
                <li aria-current="page" className="text-gray-700">
                  {title}
                </li>
              )}
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {onToggleFilters && (
            <button
              type="button"
              onClick={onToggleFilters}
              className="flex h-9 items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-3 text-sm text-white transition-colors hover:border-gray-600 lg:hidden"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          )}
          {onSortChange && sortBy !== undefined && (
            <LensSortControl value={sortBy} onChange={onSortChange} />
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-[#e8e8e8]" />

      <div className="pt-8" aria-busy={loading || fetching}>
        {loading ? (
          <LensGridSkeleton />
        ) : lenses.length === 0 ? (
          <EmptyState title="No lenses found" />
        ) : (
          <div className={GRID_CLASSES}>
            {lenses.map((lens, index) => (
              <LensCard key={lens._id || lens.id || index} lens={lens} />
            ))}
          </div>
        )}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </section>
  );
});

LensListing.displayName = "LensListing";
