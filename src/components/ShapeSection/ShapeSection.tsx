import { memo, useMemo, useState, useCallback } from "react";
import { Container } from "../Container/Container";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import type { ShapeSectionProps } from "../../types";

/** Number of items visible at once in the slider */
const ITEMS_PER_VIEW = 7;
/** Width percentage each item takes */
const ITEM_WIDTH_PERCENT = 100 / ITEMS_PER_VIEW;

/**
 * Reusable shape section component with horizontal slider
 * Same design as TopCategories but with sliding navigation
 * Memoized to prevent unnecessary re-renders when props don't change
 */
export const ShapeSection = memo(function ShapeSection({ 
  title, 
  shape = "box", 
  items 
}: ShapeSectionProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  /** Calculate max index for sliding */
  const maxIndex = useMemo(() => (
    Math.max(0, items.length - ITEMS_PER_VIEW)
  ), [items.length]);

  /** Check if we can navigate */
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  /** Memoized navigation handlers */
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  /** Memoize border radius based on shape prop */
  const borderRadius = useMemo(() => (
    shape === "circle" ? "50%" : "16px"
  ), [shape]);

  /** Memoize slider transform style */
  const sliderStyle = useMemo(() => ({
    transform: `translateX(-${currentIndex * ITEM_WIDTH_PERCENT}%)`
  }), [currentIndex]);

  /** Memoize shape items to prevent recreation */
  const shapeItems = useMemo(() => (
    items.map((item, index) => (
      <div 
        key={index} 
        className="shrink-0 flex flex-col items-center gap-4 px-3"
        style={{ width: `${ITEM_WIDTH_PERCENT}%` }}
      >
        {/* Card Container - Square aspect ratio for proper circle/box shape */}
        <div
          className="relative flex items-center justify-center overflow-hidden w-full"
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: borderRadius,
            aspectRatio: "1 / 1",
          }}
        >
          {/* Shape Image */}
          <img
            src={item.image}
            alt={item.label}
            className="w-4/5 h-4/5 object-contain"
            loading="lazy"
          />
        </div>
        {/* Shape Label */}
        <span
          className="text-center font-medium"
          style={{ color: "darkgoldenrod", fontSize: "20px" }}
        >
          {item.label}
        </span>
      </div>
    ))
  ), [items, borderRadius]);

  return (
    <section
      className="w-full bg-white"
      style={{ paddingTop: "48px", paddingBottom: "48px" }}
    >
      <Container>
        {/* Header with title and navigation */}
        <div className="flex items-center justify-between mb-3">
        <h2
          className="font-semibold mb-3"
          style={{ fontSize: "30px", color: "#1a1a1a" }}
        >
            {title}
          </h2>
          
          {/* Navigation Arrows */}
          <div className="flex items-center ">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
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
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
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

        {/* Slider Container */}
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
