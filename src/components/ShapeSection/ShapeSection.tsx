import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { Container } from "../Container/Container";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import type { ShapeSectionProps } from "../../types";

function getItemsPerView(width: number): number {
  if (width < 640) return 4;
  if (width < 768) return 5;
  if (width < 1024) return 6;
  if (width < 1280) return 7;
  return 8;
}

/**
 * Shape Section - horizontal scroll, equal items
 */
export const ShapeSection = memo(function ShapeSection({ 
  title, 
  shape = "box", 
  items 
}: ShapeSectionProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(() => {
    if (typeof window === "undefined") return 8;
    return getItemsPerView(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      const next = getItemsPerView(window.innerWidth);
      setItemsPerView((prev) => (prev === next ? prev : next));
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemWidthPercent = useMemo(() => 100 / itemsPerView, [itemsPerView]);
  
  const maxIndex = useMemo(() => (
    Math.max(0, items.length - itemsPerView)
  ), [items.length, itemsPerView]);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const borderRadius = shape === "circle" ? "50%" : "12px";

  const sliderStyle = useMemo(() => ({
    transform: `translateX(-${currentIndex * itemWidthPercent}%)`
  }), [currentIndex, itemWidthPercent]);

  const shapeItems = useMemo(() => (
    items.map((item, index) => (
      <div 
        key={index} 
        className="shrink-0 flex flex-col items-center px-1"
        style={{ width: `${itemWidthPercent}%` }}
      >
        <div
          className="relative flex items-center justify-center w-full bg-gray-50 overflow-hidden"
          style={{
            borderRadius: borderRadius,
            aspectRatio: "1 / 1",
          }}
        >
          <img
            src={item.image}
            alt={item.label}
            className="w-4/5 h-4/5 object-contain"
            loading="lazy"
          />
        </div>
        <span className="mt-1 text-center font-medium text-[10px] sm:text-xs text-gray-700">
          {item.label}
        </span>
      </div>
    ))
  ), [items, borderRadius, itemWidthPercent]);

  return (
    <section className="w-full bg-white py-3 sm:py-4">
      <Container>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm sm:text-base text-gray-900 flex-1 pr-2">
            {title}
          </h2>
          
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all ${
                canGoPrev 
                  ? "border-gray-300 text-gray-600 hover:bg-gray-100" 
                  : "border-gray-200 text-gray-300 cursor-not-allowed opacity-50"
              }`}
              aria-label="Previous"
            >
              <ChevronLeftIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all ${
                canGoNext 
                  ? "border-gray-300 text-gray-600 hover:bg-gray-100" 
                  : "border-gray-200 text-gray-300 cursor-not-allowed opacity-50"
              }`}
              aria-label="Next"
            >
              <ChevronRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden -mx-3 px-3">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={sliderStyle}
          >
            {shapeItems}
          </div>
        </div>
      </Container>
    </section>
  );
});

ShapeSection.displayName = "ShapeSection";
