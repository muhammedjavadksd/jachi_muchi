import { memo, useState, useCallback } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  maxRating?: number;
}

const SIZE_MAP: Record<string, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

function StarSvg({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export const StarRating = memo(function StarRating({
  value,
  onChange,
  readOnly = true,
  size = "sm",
  maxRating = 5,
}: StarRatingProps): JSX.Element {
  const [hoverValue, setHoverValue] = useState(0);

  const interactive = !readOnly && typeof onChange === "function";
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.sm;
  const displayValue = interactive && hoverValue > 0 ? hoverValue : value;

  const handleClick = useCallback(
    (star: number) => {
      if (interactive) onChange?.(star);
    },
    [interactive, onChange]
  );

  const handleMouseEnter = useCallback(
    (star: number) => {
      if (interactive) setHoverValue(star);
    },
    [interactive]
  );

  const handleMouseLeave = useCallback(() => {
    if (interactive) setHoverValue(0);
  }, [interactive]);

  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    const fillPercent = Math.max(0, Math.min(100, (displayValue - (i - 1)) * 100));
    const starContent = (
      <span className="relative inline-block leading-none">
        <StarSvg className={`${sizeClass} text-gray-200`} />
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          <StarSvg className={`${sizeClass} text-amber-400`} />
        </span>
      </span>
    );

    stars.push(
      interactive ? (
        <button
          key={i}
          type="button"
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          aria-label={`Rate ${i} out of ${maxRating}`}
          className="inline-flex"
        >
          {starContent}
        </button>
      ) : (
        <span key={i} className="inline-flex">
          {starContent}
        </span>
      )
    );
  }

  return <div className="inline-flex items-center gap-0.5">{stars}</div>;
});

StarRating.displayName = "StarRating";
