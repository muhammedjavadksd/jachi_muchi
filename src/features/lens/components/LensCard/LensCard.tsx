import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Price, SafeImage } from "@/shared/components";
import { LENS_DETAIL_PATH, LENS_FALLBACK_IMAGE } from "@/features/lens/constants";
import { getLensId } from "@/features/lens/utils/detail";
import { getLensPricing } from "@/features/lens/utils/pricing";
import type { LensItem } from "@/features/lens/types";

export interface LensCardProps {
  lens: LensItem;
}

const CARD_CLASSES =
  "group flex h-full flex-col border border-[#e8e8e8] bg-white transition-colors duration-200 hover:border-[#bdbdbd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8860b] focus-visible:ring-offset-2";

/**
 * Lens listing card. Links to the lens detail page when the API supplies an
 * id, and keeps the same square image frame and pricing for every item.
 */
export const LensCard = memo(function LensCard({ lens }: LensCardProps): JSX.Element {
  const brandName = useMemo(() => lens.brand?.name?.trim() ?? "", [lens.brand]);
  const lensId = getLensId(lens);
  const pricing = useMemo(() => getLensPricing(lens), [lens]);

  const content = (
    <>
      <div className="relative aspect-square overflow-hidden bg-[#f6f6f6]">
        <SafeImage
          src={lens.image}
          alt={lens.name}
          fallback={LENS_FALLBACK_IMAGE}
          className="h-full w-full object-contain p-[8%]"
        />
      </div>

      <div className="flex flex-1 flex-col px-[21px] py-5">
        <p className="min-h-[18px] truncate text-xs uppercase tracking-[0.05em] text-gray-500">
          {brandName}
        </p>
        <h3 className="mt-1 truncate text-lg font-normal text-[#1a1a1a]">{lens.name}</h3>
        <div className="mt-2">
          <Price
            value={pricing.currentPrice}
            originalValue={pricing.originalPrice}
            discount={pricing.discountPercent}
            size="md"
          />
        </div>
      </div>
    </>
  );

  if (!lensId) {
    return <article className={CARD_CLASSES}>{content}</article>;
  }

  return (
    <Link
      to={`${LENS_DETAIL_PATH}/${lensId}`}
      className={CARD_CLASSES}
      aria-label={`View ${lens.name}`}
    >
      {content}
    </Link>
  );
});

LensCard.displayName = "LensCard";
