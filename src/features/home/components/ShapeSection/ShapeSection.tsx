import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { Container } from "@/shared/components/Container/Container";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/components/Icons";
import type { ShapeSectionProps } from "@/features/home/types";
import { useNavigate } from "react-router-dom";

function getItemsPerView(width: number): number {
  if (width < 640) return 4;
  if (width < 1024) return 5;
  if (width < 1280) return 6;
  return 7;
}

export const ShapeSection = memo(function ShapeSection({ 
  title, 
  shape = "box", 
  items,
  categorySlug,
}: ShapeSectionProps): JSX.Element {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(() => {
    if (typeof window === "undefined") return 7;
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

  const borderRadius = useMemo(() => (
    shape === "circle" ? "50%" : "16px"
  ), [shape]);

  const sliderStyle = useMemo(() => ({
    transform: `translateX(-${currentIndex * itemWidthPercent}%)`
  }), [currentIndex, itemWidthPercent]);

  const shapeItems = useMemo(() => (
    items.map((item, index) => (
      <button
        key={index}
        type="button"
        onClick={() => {
          if (categorySlug) {
            navigate(`/search/${categorySlug}?shape=${item.label}`);
          }
        }}
        className="shrink-0 flex flex-col items-center gap-2 md:gap-3 lg:gap-4 px-2 sm:px-3 cursor-pointer hover:opacity-80 transition-opacity"
        style={{ width: `${itemWidthPercent}%` }}
      >
        <div
          className="relative flex items-center justify-center overflow-hidden w-full"
          style={{
            backgroundColor: "#f6f6f6",
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
        <span
          className="text-center font-medium text-xs sm:text-sm md:text-base lg:text-lg"
          style={{ color: "darkgoldenrod" }}
        >
          {item.label}
        </span>
      </button>
    ))
  ), [items, borderRadius, itemWidthPercent, categorySlug, navigate]);

  return (
    <section
      className="w-full bg-white py-8 md:py-12"
    >
      <Container>
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5 md:mb-6">
          <h2
          className="font-semibold text-lg sm:text-md md:text-2xl lg:text-[30px] text-[#1a1a1a] max-w-[70%] sm:max-w-[75%]"
            style={{ color: "#1a1a1a" }}
          >
            {title}
          </h2>
          
          <div className="flex items-center">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors ${
                canGoPrev 
                  ? "border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer" 
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Previous"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors ${
                canGoNext 
                  ? "border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer" 
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Next"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out -mx-3"
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

