import { memo, useCallback, useMemo, useState } from "react";
import { SafeImage } from "@/shared/components";
import { LENS_FALLBACK_IMAGE } from "@/features/lens/constants";

export interface LensDetailGalleryProps {
  image?: string;
  name: string;
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8860b] focus-visible:ring-offset-2";

export const LensDetailGallery = memo(function LensDetailGallery({
  image,
  name,
}: LensDetailGalleryProps): JSX.Element {
  const images = useMemo(
    () => (image ? [image] : [LENS_FALLBACK_IMAGE]),
    [image]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const activeImage = images[currentIndex] ?? images[0];

  const goToImage = useCallback((index: number) => setCurrentIndex(index), []);
  const goToPrev = useCallback(() => {
    setCurrentIndex((index) => (index - 1 + images.length) % images.length);
  }, [images.length]);
  const goToNext = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % images.length);
  }, [images.length]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        {hasMultiple && (
          <div className="hidden max-h-[620px] flex-col gap-2 overflow-y-auto pr-1 md:flex">
            {images.map((source, index) => (
              <button
                key={`${source}-${index}`}
                type="button"
                onClick={() => goToImage(index)}
                aria-label={`View ${name} image ${index + 1}`}
                aria-current={index === currentIndex}
                className={`h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border-2 transition-all ${FOCUS_RING} ${
                  index === currentIndex
                    ? "border-[#b8860b] opacity-100"
                    : "border-gray-200 opacity-60 hover:opacity-100"
                }`}
              >
                <SafeImage
                  src={source}
                  alt=""
                  fallback={LENS_FALLBACK_IMAGE}
                  className="h-full w-full bg-white object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}

        <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-[#f6f6f6]">
          <div className="aspect-square w-full sm:aspect-[4/3] lg:max-h-[620px]">
            <SafeImage
              src={activeImage}
              alt={name}
              fallback={LENS_FALLBACK_IMAGE}
              loading="eager"
              className="h-full w-full object-contain p-6 md:p-10"
            />
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Previous image"
                className={`absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:bg-white active:scale-95 ${FOCUS_RING}`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next image"
                className={`absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:bg-white active:scale-95 ${FOCUS_RING}`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {images.map((source, index) => (
            <button
              key={`${source}-${index}`}
              type="button"
              onClick={() => goToImage(index)}
              aria-label={`View ${name} image ${index + 1}`}
              aria-current={index === currentIndex}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${FOCUS_RING} ${
                index === currentIndex
                  ? "border-[#b8860b] opacity-100"
                  : "border-gray-200 opacity-60"
              }`}
            >
              <SafeImage
                src={source}
                alt=""
                fallback={LENS_FALLBACK_IMAGE}
                className="h-full w-full bg-white object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

LensDetailGallery.displayName = "LensDetailGallery";
