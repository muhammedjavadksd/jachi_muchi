import { memo, useMemo, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { useSlider } from "../../hooks";

interface Banner {
  _id?: string;
  image: string;
  redirectUrl?: string;
  title?: string;
}

interface HeroSliderProps {
  banners: Banner[];
}

export const HeroSlider = memo(function HeroSlider({ banners }: HeroSliderProps): JSX.Element | null {
  const { currentSlide, nextSlide, prevSlide, goToSlide } = useSlider(banners.length);

  if (!banners || banners.length === 0) return null;

  /** Memoize slider transform style */
  const sliderStyle = useMemo(() => ({
    transform: `translateX(-${currentSlide * 100}%)`
  }), [currentSlide]);

  /** Memoize slide elements */
  const slideElements = useMemo(() => (
    banners.map((banner, index) => (
      <a 
        key={banner._id || index} 
        href={banner.redirectUrl || "#"} 
        className="w-full flex-shrink-0 relative block"
      >
        <img
          src={banner.image}
          alt={banner.title || `Banner ${index + 1}`}
          className="w-full h-[180px] sm:h-[250px] md:h-[320px] lg:h-[400px] object-cover"
          loading={index === 0 ? "eager" : "lazy"}
        />
      </a>
    ))
  ), [banners]);

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
    banners.map((_, index) => (
      <button
        key={index}
        onClick={() => goToSlide(index)}
        className={getDotClassName(index)}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))
  ), [banners.length, getDotClassName, goToSlide]);

  return (
    <section className="w-full relative block" style={{ marginTop: '0px' }}>
      <div className="w-full relative overflow-hidden" style={{ marginTop: '0px' }}>
        {/* Slides Container */}
        <div
          className="w-full flex transition-transform duration-500 ease-in-out"
          style={sliderStyle}
        >
          {slideElements}
        </div>

        {banners.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="absolute bottom-4 sm:bottom-6 left-2 sm:left-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/15 border border-white/30 text-white flex items-center justify-center z-10 hover:bg-white/25 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon />
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute bottom-4 sm:bottom-6 right-2 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/15 border border-white/30 text-white flex items-center justify-center z-10 hover:bg-white/25 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRightIcon />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2.5 z-10">
              {paginationDots}
            </div>
          </>
        )}
      </div>
    </section>
  );
});

HeroSlider.displayName = "HeroSlider";


// import { memo, useMemo, useCallback } from "react";
// import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
// import { useSlider } from "../../hooks";
// import { HERO_BANNER_IMAGES } from "../../lib/constants";

// /**
//  * Hero slider/carousel component for homepage banners
//  * Features navigation arrows at corners and centered pagination dots
//  * Memoized to prevent unnecessary re-renders
//  */
// export const HeroSlider = memo(function HeroSlider(): JSX.Element {
//   const { currentSlide, nextSlide, prevSlide, goToSlide } = useSlider(HERO_BANNER_IMAGES.length);

//   /** Memoize slider transform style */
//   const sliderStyle = useMemo(() => ({
//     transform: `translateX(-${currentSlide * 100}%)`
//   }), [currentSlide]);

//   /** Memoize slide elements to prevent recreation */
//   const slideElements = useMemo(() => (
//     HERO_BANNER_IMAGES.map((image, index) => (
//       <div key={index} className="w-full flex-shrink-0 relative block">
//         <img
//           src={image}
//           alt={`Banner ${index + 1}`}
//           // className="w-full h-auto block object-cover"
//           className="w-full h-[180px] sm:h-[250px] md:h-[320px] lg:h-[400px] object-cover"
//           loading={index === 0 ? "eager" : "lazy"}
//         />
//       </div>
//     ))
//   ), []);

//   /** Memoize pagination dot class generator */
//   const getDotClassName = useCallback((index: number) => (
//     `h-2.5 rounded-full transition-all cursor-pointer ${
//       currentSlide === index
//         ? "w-2.5 bg-white"
//         : "w-2.5 bg-white/40 hover:bg-white/60"
//     }`
//   ), [currentSlide]);

//   /** Memoize pagination dots */
//   const paginationDots = useMemo(() => (
//     HERO_BANNER_IMAGES.map((_, index) => (
//       <button
//         key={index}
//         onClick={() => goToSlide(index)}
//         className={getDotClassName(index)}
//         aria-label={`Go to slide ${index + 1}`}
//       />
//     ))
//   ), [getDotClassName, goToSlide]);

//   return (
//     <section className="w-full relative block" style={{ marginTop: '0px' }}>
//       <div className="w-full relative overflow-hidden" style={{ marginTop: '0px' }}>
//         {/* Slides Container */}
//         <div
//           className="w-full flex transition-transform duration-500 ease-in-out"
//           style={sliderStyle}
//         >
//           {slideElements}
//         </div>

//         {/* Previous Button - Left Corner */}
//         <button
//           onClick={prevSlide}
//           className="absolute bottom-4 sm:bottom-6 left-2 sm:left-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/15 border border-white/30 text-white flex items-center justify-center z-10 hover:bg-white/25 transition-colors"
//           aria-label="Previous slide"
//         >
//           <ChevronLeftIcon />
//         </button>

//         {/* Next Button - Right Corner */}
//         <button
//           onClick={nextSlide}
//           className="absolute bottom-4 sm:bottom-6 right-2 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/15 border border-white/30 text-white flex items-center justify-center z-10 hover:bg-white/25 transition-colors"
//           aria-label="Next slide"
//         >
//           <ChevronRightIcon />
//         </button>

//         {/* Pagination Dots - Centered */}
//         <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2.5 z-10">
//           {paginationDots}
//         </div>
//       </div>
//     </section>
//   );
// });

// HeroSlider.displayName = "HeroSlider";
