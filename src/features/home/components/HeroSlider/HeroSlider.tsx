import { memo, useMemo, useCallback, useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/components/Icons";
import { ArrowRight } from "lucide-react";
import { useSlider } from "@/shared/hooks";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/shared/utils/image";

interface Banner {
  _id?: string;
  image: string;
  mobileImage?: string;
  redirectUrl?: string;
  title?: string;
}

interface HeroSliderProps {
  banners: Banner[];
}

const MobileHeroSlider = memo(function MobileHeroSlider({ banners }: { banners: Banner[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string | number, boolean>>({});
  const [failedMobileImages, setFailedMobileImages] = useState<Record<string | number, boolean>>({});

  const total = banners.length;
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwipingRef = useRef(false);
  const isTransitioningRef = useRef(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleNext = useCallback(() => {
    if (total <= 1 || isTransitioningRef.current) return;
    setProgress(0);

    if (prefersReducedMotion) {
      setCurrentSlide((prev) => (prev + 1) % total);
      return;
    }

    isTransitioningRef.current = true;
    setSlideDirection("next");
    setIsExiting(true);

    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % total);
      setIsExiting(false);
      isTransitioningRef.current = false;
    }, 350);
  }, [total, prefersReducedMotion]);

  const handlePrev = useCallback(() => {
    if (total <= 1 || isTransitioningRef.current) return;
    setProgress(0);

    if (prefersReducedMotion) {
      setCurrentSlide((prev) => (prev - 1 + total) % total);
      return;
    }

    isTransitioningRef.current = true;
    setSlideDirection("prev");
    setIsExiting(true);

    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + total) % total);
      setIsExiting(false);
      isTransitioningRef.current = false;
    }, 350);
  }, [total, prefersReducedMotion]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [total, isPaused, handleNext]);

  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current !== null && isSwipingRef.current) {
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - touchStartX.current;
      if (Math.abs(diffX) >= 50) {
        if (diffX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 100);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSwipingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleImageError = (key: string | number, usedMobile: boolean) => {
    const setFailed = usedMobile ? setFailedMobileImages : setFailedImages;
    setFailed((prev) => ({ ...prev, [key]: true }));
  };

  const card1Index = currentSlide;
  const card2Index = total > 1 ? (currentSlide + 1) % total : null;
  const card3Index = total > 2 ? (currentSlide + 2) % total : null;

  const renderCardImage = (banner: Banner, bannerIndex: number) => {
    const key = banner._id || bannerIndex;
    if (failedImages[key]) {
      return <div className="w-full h-full bg-gray-200" />;
    }

    const usedMobile = !!banner.mobileImage && !failedMobileImages[key];
    const imageUrl = getImageUrl(usedMobile ? banner.mobileImage! : banner.image);
    return (
      <img
        key={usedMobile ? "mobile" : "image"}
        src={imageUrl}
        alt={banner.title || `Banner ${bannerIndex + 1}`}
        className="w-full h-full object-cover object-center"
        loading={bannerIndex === 0 ? "eager" : "lazy"}
        fetchPriority={bannerIndex === 0 ? "high" : "auto"}
        onError={() => handleImageError(key, usedMobile)}
      />
    );
  };

  const card1Banner = banners[card1Index];
  const card2Banner = card2Index !== null ? banners[card2Index] : null;
  const card3Banner = card3Index !== null ? banners[card3Index] : null;

  const counterText = `${String(currentSlide + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <section
      className="w-full relative block md:hidden"
      aria-roledescription="carousel"
      aria-label="Hero Banners"
    >
      <div className="mx-4 mt-3 relative">
        {/* Card 3 (Furthest back: inset 24px each side, top-[26px]) */}
        {card3Banner && (
          <div
            className={`absolute top-[26px] bottom-[-2px] left-[24px] right-[24px] rounded-3xl overflow-hidden bg-gray-100 z-10 transition-all duration-350 ease-out ${
              isExiting
                ? "-translate-y-[12px] left-[12px] right-[12px]"
                : ""
            }`}
          >
            {renderCardImage(card3Banner, card3Index!)}
            <div
              className={`absolute inset-0 bg-black/45 transition-colors duration-350 ${
                isExiting ? "bg-black/30" : ""
              }`}
            />
          </div>
        )}

        {/* Card 2 (Middle: inset 12px each side, top-[14px]) */}
        {card2Banner && (
          <div
            className={`absolute top-[14px] bottom-[10px] left-[12px] right-[12px] rounded-3xl overflow-hidden bg-gray-100 z-20 transition-all duration-350 ease-out ${
              isExiting
                ? "-translate-y-[14px] left-0 right-0"
                : ""
            }`}
          >
            {renderCardImage(card2Banner, card2Index!)}
            <div
              className={`absolute inset-0 bg-black/30 transition-colors duration-350 ${
                isExiting ? "bg-black/0" : ""
              }`}
            />
          </div>
        )}

        {/* Card 1 (Front card wrapper with padding-bottom: 24px and z-30) */}
        <div className="relative pb-[24px] z-30">
          <div
            className={`relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 transition-all duration-350 ease-out ${
              isExiting
                ? slideDirection === "next"
                  ? "-translate-x-12 opacity-0"
                  : "translate-x-12 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-label={`Banner ${currentSlide + 1} of ${total}`}
          >
          {/* Card Link */}
          {card1Banner.redirectUrl && card1Banner.redirectUrl.startsWith("http") ? (
            <a
              href={card1Banner.redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCardClick}
              className="w-full h-full block relative"
            >
              {renderCardImage(card1Banner, card1Index)}
            </a>
          ) : (
            <Link
              to={card1Banner.redirectUrl || "#"}
              onClick={handleCardClick}
              className="w-full h-full block relative"
            >
              {renderCardImage(card1Banner, card1Index)}
            </Link>
          )}

          {/* Story-style progress bars */}
          {total > 1 && (
            <div
              className="absolute top-3 left-[14px] right-[14px] z-20 flex gap-1 items-center p-1.5 rounded-full bg-black/25 backdrop-blur-xs drop-shadow-sm"
              aria-hidden="true"
            >
              {banners.map((_, index) => (
                <div
                  key={index}
                  className="h-[3px] flex-1 bg-white/40 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
                    style={{
                      width:
                        index < currentSlide
                          ? "100%"
                          : index === currentSlide
                          ? `${progress}%`
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Counter badge (bottom-left) */}
          {total > 1 && (
            <div className="absolute bottom-3 left-3 z-20 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-xs select-none">
              {counterText}
            </div>
          )}

          {/* Round "Next" button (bottom-right) */}
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleNext();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="absolute bottom-3 right-3 z-20 w-[42px] h-[42px] rounded-full bg-white text-black flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
              aria-label="Next banner"
            >
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          )}
          </div>
        </div>
      </div>
    </section>
  );
});

MobileHeroSlider.displayName = "MobileHeroSlider";

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
            className="w-full h-auto md:h-[320px] lg:h-[400px] md:object-cover"
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
    <>
      <MobileHeroSlider banners={banners} />
      <section className="w-full relative hidden md:block" style={{ marginTop: '0px' }}>
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
    </>
  );
});

HeroSlider.displayName = "HeroSlider";


