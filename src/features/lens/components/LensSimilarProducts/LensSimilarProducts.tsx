import { memo } from "react";
import { AutoScrollCarousel } from "@/shared/components";
import { LensCard } from "@/features/lens/components/LensCard/LensCard";
import { LENS_DETAIL_COPY, LENS_GRID_SKELETON_COUNT } from "@/features/lens/constants";
import { getLensId } from "@/features/lens/utils/detail";
import type { LensItem } from "@/features/lens/types";

export interface LensSimilarProductsProps {
  lenses: LensItem[];
  loading: boolean;
}

export const LensSimilarProducts = memo(function LensSimilarProducts({
  lenses,
  loading,
}: LensSimilarProductsProps): JSX.Element | null {
  if (!loading && lenses.length === 0) return null;

  return (
    <section
      id="similar-products"
      aria-labelledby="similar-products-title"
      className="scroll-mt-32 pb-4"
    >
      <h2
        id="similar-products-title"
        className="mb-5 text-xl font-semibold text-[#1a1a1a]"
      >
        {LENS_DETAIL_COPY.similarTitle}
      </h2>

      {loading && lenses.length === 0 ? (
        <div className="flex gap-4 overflow-hidden" aria-hidden>
          {Array.from({ length: Math.min(LENS_GRID_SKELETON_COUNT, 4) }).map(
            (_, index) => (
              <div
                key={index}
                className="w-[240px] shrink-0 border border-[#e8e8e8] bg-white sm:w-[280px]"
              >
                <div className="aspect-square animate-pulse bg-[#f6f6f6]" />
                <div className="space-y-3 px-5 py-5">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <AutoScrollCarousel
          items={lenses}
          ariaLabel={LENS_DETAIL_COPY.similarTitle}
          autoPlay={false}
          keyExtractor={(lens) => getLensId(lens) ?? lens.name}
          renderCard={(lens) => <LensCard lens={lens} />}
        />
      )}
    </section>
  );
});

LensSimilarProducts.displayName = "LensSimilarProducts";
