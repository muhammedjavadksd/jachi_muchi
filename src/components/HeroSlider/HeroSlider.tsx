import { memo, useMemo, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { useSlider } from "../../hooks";
import { HERO_BANNER_IMAGES, HERO_BANNER_DATA } from "../../lib/constants";

/**
 * Hero slider - full-width, centered dots, mobile-first
 */
export const HeroSlider = memo(function HeroSlider(): JSX.Element {
  const { currentSlide, nextSlide, prevSlide, goToSlide } = useSlider(HERO_BANNER_IMAGES.length);

  const sliderStyle = useMemo(() => ({
    transform: `translateX(-${currentSlide * 100}%)`
  }), [currentSlide]);

  const slideElements = useMemo(() => (
    HERO_BANNER_IMAGES.map((image, index) => {
      const bannerData = HERO_BANNER_DATA?.[index];
      
      return (
        <div key={index} className="w-full flex-shrink-0 relative">
          <img
            src={image}
            alt={bannerData?.title || `Banner ${index + 1}`}
            className="w-full h-[160px] sm:h-[200px] md:h-[260px] lg:h-[340px] object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
          
          {bannerData && (
            <div className="hidden sm:block absolute inset-0 z-10">
              <div className="h-full flex flex-col justify-center pl-6 md:pl-10 pr-24 max-w-[60%]">
                {bannerData.badge && (
                  <span className="inline-block self-start px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-2">
                    {bannerData.badge}
                  </span>
                )}
                <h2 className="text-white font-bold text-lg md:text-2xl lg:text-3xl leading-tight mb-1 drop-shadow-lg">
                  {bannerData.title}
                </h2>
                {bannerData.subtitle && (
                  <p className="text-white/90 text-sm mb-3 drop-shadow">
                    {bannerData.subtitle}
                  </p>
                )}
                {bannerData.cta && (
                  <button className="self-start px-4 py-1.5 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                    {bannerData.cta}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      );
    })
  ), []);

  const getDotClassName = useCallback((index: number) => (
    `h-1.5 w-1.5 rounded-full transition-all duration-300 ${
      currentSlide === index
        ? "bg-white w-4"
        : "bg-white/50"
    }`
  ), [currentSlide]);

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
<<<<<<< HEAD
    <section className="w-full relative overflow-hidden bg-gray-100">
      <div className="w-full overflow-hidden">
=======
    <section className="w-full relative block" style={{ marginTop: '0px' }}>
      <div className="w-full relative overflow-hidden" style={{ marginTop: '0px' }}>
        {/* Slides Container */}
>>>>>>> ecdd40ce813f1fe7225e75df122230a08481fe92
        <div
          className="w-full flex transition-transform duration-500 ease-in-out"
          style={sliderStyle}
        >
          {slideElements}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <button
          onClick={prevSlide}
<<<<<<< HEAD
          className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/25 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center pointer-events-auto rounded-full shadow"
=======
          className="absolute bottom-4 sm:bottom-6 left-2 sm:left-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/15 border border-white/30 text-white flex items-center justify-center z-10 hover:bg-white/25 transition-colors"
>>>>>>> ecdd40ce813f1fe7225e75df122230a08481fe92
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
<<<<<<< HEAD
          className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/25 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center pointer-events-auto rounded-full shadow"
=======
          className="absolute bottom-4 sm:bottom-6 right-2 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/15 border border-white/30 text-white flex items-center justify-center z-10 hover:bg-white/25 transition-colors"
>>>>>>> ecdd40ce813f1fe7225e75df122230a08481fe92
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Pagination Dots - Centered at bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {paginationDots}
      </div>
    </section>
  );
});

HeroSlider.displayName = "HeroSlider";
