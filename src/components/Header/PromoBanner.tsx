import { memo } from "react";

/**
 * Dark promo banner strip below header
 * Shows membership/discount message
 */
export const PromoBanner = memo(function PromoBanner(): JSX.Element {
  return (
    <div className="bg-gray-900 px-3 py-2">
      <div className="flex items-center justify-center gap-2 text-center">
        <span className="text-white text-xs font-medium">
          Get <span className="text-yellow-400 font-semibold">Lenskart Gold</span> at ₹99
        </span>
        <span className="text-gray-400 text-xs">|</span>
        <span className="text-gray-300 text-xs">
          Free Delivery on ₹999+
        </span>
      </div>
    </div>
  );
});

PromoBanner.displayName = "PromoBanner";
