import { memo, useMemo } from "react";
import { RatingStars } from "../RatingStars/RatingStars";
import type { ReviewSummary } from "@/types";

interface RatingBreakdownProps {
  summary: ReviewSummary;
}

export const RatingBreakdown = memo(function RatingBreakdown({
  summary,
}: RatingBreakdownProps): JSX.Element {
  const { averageRating, totalReviews, distribution } = summary;

  const sortedDistribution = useMemo(
    () => [...distribution].sort((a, b) => b.star - a.star),
    [distribution]
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl font-bold text-gray-900">
          {averageRating.toFixed(1)}
        </span>
        <div>
          <RatingStars rating={Math.round(averageRating)} size="md" />
          <p className="text-sm text-gray-500 mt-0.5">
            {totalReviews} Review{totalReviews !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        {sortedDistribution.map((item) => (
          <div
            key={item.star}
            className="flex items-center gap-2 text-sm"
          >
            <span className="w-3 text-gray-600">{item.star}</span>
            <svg
              className="w-3.5 h-3.5 text-amber-400 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="w-8 text-right text-gray-500 text-xs">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

RatingBreakdown.displayName = "RatingBreakdown";
