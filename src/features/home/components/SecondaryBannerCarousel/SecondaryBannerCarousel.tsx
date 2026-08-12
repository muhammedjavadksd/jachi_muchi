import { memo, useMemo, useState, useCallback } from "react";
import { SECONDARY_BANNERS } from "@/features/home/constants";

const VISIBLE_COUNT = 4;

export const SecondaryBannerCarousel = memo(function SecondaryBannerCarousel(): JSX.Element {
  const [_index, setIndex] = useState(0);

  const maxIndex = useMemo(
    () => Math.max(0, SECONDARY_BANNERS.length - VISIBLE_COUNT),
    []
  );

  const goNext = useCallback(() => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  return (
    <section className="w-full mt-3 px-2 sm:px-3">
      <div className="w-full max-w-350 mx-auto relative">
      <div className="overflow-hidden rounded-2xl bg-white">
  <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide">
    {SECONDARY_BANNERS.map((src, i) => (
      <div
        key={i}
        className="shrink-0 w-[80%] sm:w-[48%] md:w-[32%] lg:w-[24%]"
      >
        <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
          <img
            src={src}
            alt={`Promotion ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    ))}
  </div>
</div>

        <button
          type="button"
          onClick={goPrev}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -left-3 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 items-center justify-center text-slate-700 hover:bg-slate-50"
          aria-label="Previous banners"
        >
          <span className="inline-block -translate-x-px">&lsaquo;</span>
        </button>
        <button
          type="button"
          onClick={goNext}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-3 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 items-center justify-center text-slate-700 hover:bg-slate-50"
          aria-label="Next banners"
        >
          <span className="inline-block translate-x-px">&rsaquo;</span>
        </button>
      </div>
    </section>
  );
});

SecondaryBannerCarousel.displayName = "SecondaryBannerCarousel";
