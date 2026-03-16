import { memo, useMemo, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { useSlider } from "../../hooks";
import { HERO_BANNER_IMAGES } from "../../lib/constants";

/**
 * Hero slider/carousel component for homepage banners
 * Features navigation arrows at corners and centered pagination dots
 * Memoized to prevent unnecessary re-renders
 */
export const HeroSlider = memo(function HeroSlider(): JSX.Element {
  const { currentSlide, nextSlide, prevSlide, goToSlide } = useSlider(HERO_BANNER_IMAGES.length);

  /** Memoize slider transform style */
  const sliderStyle = useMemo(() => ({
    transform: `translateX(-${currentSlide * 100}%)`
  }), [currentSlide]);

  /** Memoize slide elements to prevent recreation */
  const slideElements = useMemo(() => (
    HERO_BANNER_IMAGES.map((image, index) => (
      <div key={index} className="w-full flex-shrink-0 relative block">
        <img
          src={image}
          alt={`Banner ${index + 1}`}
          className="w-full h-auto block object-cover"
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>
    ))
  ), []);

  /** Memoize pagination dot class generator */
  const getDotClassName = useCallback((index: number) => (
    `h-2.5 rounded-full transition-all cursor-pointer ${
      currentSlide === index
        ? "w-2.5 bg-white"
        : "w-2.5 bg-white/40 hover:bg-white/60"
    }`
  ), [currentSlide]);

  /** Memoize pagination dots */
  const paginationDots = useMemo(() => (
    HERO_BANNER_IMAGES.map((_, index) => (
      <button
        key={index}
        onClick={() => goToSlide(index)}
        className={getDotClassName(index)}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))
  ), [getDotClassName, goToSlide]);

  return (
    <section className="w-full relative overflow-hidden">
      <div className="w-full relative">
        {/* Slides Container */}
        <div
          className="w-full flex transition-transform duration-500 ease-in-out"
          style={sliderStyle}
        >
          {slideElements}
        </div>

        {/* Previous Button - Left Corner */}
        <button
          onClick={prevSlide}
          className="absolute bottom-12 left-12 w-12 h-12 bg-white/15 border border-white/30 text-white flex items-center justify-center z-10 hover:bg-white/25 transition-colors cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon />
        </button>

        {/* Next Button - Right Corner */}
        <button
          onClick={nextSlide}
          className="absolute bottom-12 right-12 w-12 h-12 bg-white/15 border border-white/30 text-white flex items-center justify-center z-10 hover:bg-white/25 transition-colors cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRightIcon />
        </button>

        {/* Pagination Dots - Centered */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
          {paginationDots}
        </div>
      </div>
    </section>
  );
});

HeroSlider.displayName = "HeroSlider";
