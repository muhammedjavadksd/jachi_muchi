import { memo, useMemo, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/components/Icons";
import { useSlider } from "@/shared/hooks";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/shared/utils/image";
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

  const sliderStyle = useMemo(() => ({
    transform: `translateX(-${currentSlide * 100}%)`
  }), [currentSlide]);

  const slideElements = useMemo(() => (
    banners.map((banner, index) => {
      const imageUrl = getImageUrl(banner.image) || `https://placehold.co/1200x400/0d9488/FFFFFF?text=${encodeURIComponent(banner.title || 'Banner')}`;
      return (
        <Link
          key={banner._id || index}
          to={banner.redirectUrl || "#"}
          className="w-full flex-shrink-0 relative block"
        >
          <img
            src={imageUrl}
            alt={banner.title || `Banner ${index + 1}`}
            className="w-full h-[180px] sm:h-[250px] md:h-[320px] lg:h-[400px] object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </Link>
      )
    })
  ), [banners]);

  const getDotClassName = useCallback((index: number) => (
    `h-2.5 rounded-full transition-all cursor-pointer ${currentSlide === index
      ? "w-2.5 bg-white"
      : "w-2.5 bg-white/40 hover:bg-white/60"
    }`
  ), [currentSlide]);

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
        <div
          className="w-full flex transition-transform duration-500 ease-in-out"
          style={sliderStyle}
        >
          {slideElements}
        </div>

        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute bottom-4 sm:bottom-6 left-2 sm:left-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/15 border border-white/30 text-white flex items-center justify-center z-10 hover:bg-white/25 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon />
            </button>

            <button
              onClick={nextSlide}
              className="absolute bottom-4 sm:bottom-6 right-2 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/15 border border-white/30 text-white flex items-center justify-center z-10 hover:bg-white/25 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRightIcon />
            </button>

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

