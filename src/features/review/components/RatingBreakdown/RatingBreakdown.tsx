import { memo, useMemo } from "react";
import { StarRating } from "@/features/review/components/StarRating/StarRating";
import type { RatingDistributionItem } from "@/features/review/types";

interface RatingBreakdownProps {
  averageRating: number;
  totalReviews: number;
  distribution?: RatingDistributionItem[];
}

const STAR_LEVELS = [5, 4, 3, 2, 1];

export const RatingBreakdown = memo(function RatingBreakdown({
  averageRating,
  totalReviews,
  distribution,
}: RatingBreakdownProps): JSX.Element {
  const countByStar = useMemo(() => {
    const map = new Map<number, RatingDistributionItem>();
    (distribution || []).forEach((item) => map.set(item.star, item));
    return map;
  }, [distribution]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-2xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
        <div className="flex items-center gap-5 shrink-0">
          <p className="text-5xl font-bold text-gray-900 leading-none tabular-nums">
            {averageRating.toFixed(1)}
          </p>
          <div>
            <StarRating value={averageRating} readOnly size="sm" />
            <p className="text-xs text-gray-500 mt-1.5">
              Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="hidden sm:block w-px self-stretch bg-gray-200" />

        <div className="flex-1 space-y-2 min-w-0">
          {STAR_LEVELS.map((star) => {
            const item = countByStar.get(star);
            const count = item?.count ?? 0;
            const percentage = item?.percentage ?? 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-7 text-right font-medium text-gray-600 shrink-0">
                  {star} ★
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 text-right text-gray-400 tabular-nums shrink-0">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

RatingBreakdown.displayName = "RatingBreakdown";
