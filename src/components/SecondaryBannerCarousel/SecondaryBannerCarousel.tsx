import { memo } from "react";
import { SECONDARY_BANNERS } from "../../lib/constants";

/**
 * Secondary Banner Carousel - edge-to-edge, 2 cols mobile, 4 cols desktop
 */
export const SecondaryBannerCarousel = memo(function SecondaryBannerCarousel(): JSX.Element {
  return (
    <section className="w-full bg-white">
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide snap-x px-3">
        {SECONDARY_BANNERS.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[calc(25%-6px)] snap-center"
          >
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={src}
                alt={`Promotion ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

SecondaryBannerCarousel.displayName = "SecondaryBannerCarousel";
