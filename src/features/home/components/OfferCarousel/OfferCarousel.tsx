import { memo, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getActiveOffers } from "@/features/offer/services/offerService";
import type { Offer } from "@/features/offer/types";
import { getImageUrl } from "@/shared/utils/image";

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  buttonText?: string;
  link?: string;
}

interface OfferCarouselProps {
  slides?: CarouselSlide[];
  autoPlayInterval?: number;
}

function mapOfferToSlide(offer: Offer): CarouselSlide {
  const imageUrl = (offer as any).bannerImage || offer.image;
  
  let subtitle = "";
  
  switch (offer.offerType) {
    case "percentage":
      subtitle = `Get ${offer.discountValue}% OFF${offer.couponCode ? ` | Use code: ${offer.couponCode}` : ""}`;
      break;
    case "flat":
      subtitle = `Flat ₹${offer.discountValue} OFF${offer.couponCode ? ` | Use code: ${offer.couponCode}` : ""}`;
      break;
    case "bogo":
      subtitle = `Buy ${offer.buyQuantity || 1} Get ${offer.getQuantity || 1} Free`;
      break;
    case "combo":
      subtitle = `Special Combo at ₹${offer.comboPrice}`;
      break;
    case "seasonal":
      subtitle = `${offer.discountValue}% OFF on selected items`;
      break;
    default:
      subtitle = "";
  }
  
  let finalImageUrl = imageUrl;
  if (!finalImageUrl) {
    const title = encodeURIComponent(offer.offerName);
    finalImageUrl = `https://placehold.co/1400x500/1e293b/FFFFFF?text=${title.replace(/ /g, '+')}`;
  }
  
  return {
    id: offer._id,
    title: offer.offerName,
    subtitle: subtitle || undefined,
    image: finalImageUrl,
    buttonText: offer.buttonText || "Shop Now",
    link: offer.link || "/search",
  };
}

const FALLBACK_IMG = "https://placehold.co/1400x500/1e293b/FFFFFF?text=Special+Offer";

export const OfferCarousel = memo(function OfferCarousel({
  slides: slidesProp,
  autoPlayInterval = 4000,
}: OfferCarouselProps): JSX.Element | null {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (slidesProp) return;
    setOffersLoading(true);
    getActiveOffers()
      .then((data) => {
        setOffers(data);
        setCurrentSlide(0);
      })
      .catch(() => setOffers([]))
      .finally(() => setOffersLoading(false));
  }, [slidesProp]);

  const slides: CarouselSlide[] = useMemo(
    () => slidesProp || offers.map(mapOfferToSlide),
    [slidesProp, offers]
  );

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) setCurrentSlide(index);
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1 || isPaused || offersLoading) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(nextSlide, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isPaused, nextSlide, autoPlayInterval, offersLoading]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    },
    [touchStart, nextSlide, prevSlide]
  );

  if (offersLoading && !slidesProp) {
    return (
      <section className="w-full bg-gray-100">
        <div className="w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[480px] animate-pulse" />
      </section>
    );
  }

  if (totalSlides === 0) return null;

  return (
    <section
      className="w-full relative overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[480px]">
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <a
              key={slide.id}
              href={slide.link || "#"}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={getImageUrl(slide.image) || FALLBACK_IMG}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMG;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              <div className="relative z-10 h-full flex items-center px-6 sm:px-12 md:px-16 lg:px-24">
                <div className="max-w-xl">
                  <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="text-white/90 text-sm sm:text-base md:text-lg mt-2 sm:mt-3 md:mt-4 drop-shadow max-w-md">
                      {slide.subtitle}
                    </p>
                  )}
                  <div className="mt-4 sm:mt-6 md:mt-8">
                    <span className="inline-block px-6 sm:px-8 py-2.5 sm:py-3.5 bg-white text-gray-900 font-semibold rounded-full text-sm sm:text-base hover:bg-gray-100 transition-colors shadow-lg">
                      {slide.buttonText || "Shop Now"}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all z-20"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all z-20"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 z-20">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-white"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
});

OfferCarousel.displayName = "OfferCarousel";
