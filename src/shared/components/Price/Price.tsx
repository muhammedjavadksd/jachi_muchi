import { memo, useMemo } from "react";
import { CURRENCY_SYMBOL } from "@/shared/constants";

const SIZE_MAP = {
  xs: { currency: "text-[0.65em]", number: "text-xs" },
  sm: { currency: "text-[0.65em]", number: "text-sm" },
  md: { currency: "text-[0.7em]", number: "text-base" },
  lg: { currency: "text-[0.7em]", number: "text-lg" },
  xl: { currency: "text-[0.7em]", number: "text-xl" },
  "2xl": { currency: "text-[0.7em]", number: "text-2xl sm:text-3xl" },
  "3xl": { currency: "text-[0.7em]", number: "text-3xl md:text-4xl" },
} as const;

export type PriceSize = keyof typeof SIZE_MAP;

interface PriceProps {
  value: number | string;
  originalValue?: number | string;
  discount?: number;
  free?: boolean;
  size?: PriceSize;
  negated?: boolean;
  className?: string;
}

export const Price = memo(function Price({
  value,
  originalValue,
  discount,
  free = false,
  size = "md",
  negated = false,
  className = "",
}: PriceProps): JSX.Element {
  const s = SIZE_MAP[size];
  const prefix = negated ? "-" : "";

  const formatted = useMemo(() => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? String(value) : Math.round(num).toLocaleString("en-IN");
  }, [value]);

  const formattedOriginal = useMemo(() => {
    if (originalValue == null) return null;
    const num = typeof originalValue === "string" ? parseFloat(originalValue) : originalValue;
    return isNaN(num) ? String(originalValue) : Math.round(num).toLocaleString("en-IN");
  }, [originalValue]);

  if (free) {
    return (
      <span className={`${className} font-bold text-green-600`}>
        FREE
      </span>
    );
  }

  return (
    <span className={`${className} whitespace-nowrap`}>
      <span className={`${s.currency} font-normal text-inherit opacity-70`}>
        {prefix}{CURRENCY_SYMBOL}
      </span>
      <span className={`${s.number} font-bold`}>{formatted}</span>
      {formattedOriginal != null && (
        <span className={`${s.number} font-normal text-gray-400 line-through ml-1.5`}>
          {formattedOriginal}
        </span>
      )}
      {discount != null && discount > 0 && (
        <span className="text-green-600 text-xs font-semibold ml-1.5">
          ({discount}% OFF)
        </span>
      )}
    </span>
  );
});

Price.displayName = "Price";
