import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselSlide {
  category: string;
  image: string;
  link: string;
}

const SLIDES: CarouselSlide[] = [
  {
    category: " Youth",
    image: "/category/adult.png",
    link: "/category/eyeglasses?gender=men",
  },
  {
    category: "Formal",
    image: "/category/professional.png",
    link: "/category/eyeglasses?style=formal",
  },
  {
    category: "Silvers",
    image: "/category/silver.png",
    link: "/category/eyeglasses?collection=silvers",
  },
  {
    category: "Kids",
    image: "/category/kids.png",
    link: "/category/eyeglasses?gender=kids",
  },
];

const TRIPLED = Array.from({ length: SLIDES.length * 3 }, (_, i) => SLIDES[i % SLIDES.length]);
const wrap = (i: number, len: number) => ((i % len) + len) % len;
const AUTO_PLAY_MS = 1500;
const LABEL_FADE_MS = 400;
const SLIDE_W = 320;
const GAP = 52;
const PITCH = SLIDE_W + GAP;
const SIDE_OFFSET = 2;
const VISIBLE_OFFSETS = [-2, -1, 0, 1] as const;
const SCREEN_CENTER_RATIO = 0.5;
const TRANSITION =
  "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1), filter 0.4s cubic-bezier(0.4,0,0.2,1)";

export function CenterFocusCarousel(): JSX.Element {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const labelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const prevCenterCategoryRef = useRef(SLIDES[0].category);
  const [labelVisible, setLabelVisible] = useState(true);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const clearAutoPlay = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const restartAutoPlay = useCallback(() => {
    clearAutoPlay();
    if (!pausedRef.current) {
      intervalRef.current = setInterval(() => {
        setActiveIdx((prev) => {
          const next = prev + 1;
          return next + SIDE_OFFSET >= TRIPLED.length ? SIDE_OFFSET : next;
        });
      }, AUTO_PLAY_MS);
    }
  }, [clearAutoPlay]);

  const goNext = useCallback(() => {
    setActiveIdx((prev) => {
      const next = prev + 1;
      if (next + SIDE_OFFSET >= TRIPLED.length) return SIDE_OFFSET;
      return next;
    });
    restartAutoPlay();
  }, [restartAutoPlay]);

  const goPrev = useCallback(() => {
    setActiveIdx((prev) => {
      const next = prev - 1;
      if (next - SIDE_OFFSET < 0) return TRIPLED.length - 1 - SIDE_OFFSET;
      return next;
    });
    restartAutoPlay();
  }, [restartAutoPlay]);

  const goToSlide = useCallback(
    (targetSlideIdx: number) => {
      setActiveIdx((prev) => {
        const currentSlide = prev % SLIDES.length;
        let diff = targetSlideIdx - currentSlide;
        if (diff > SLIDES.length / 2) diff -= SLIDES.length;
        if (diff < -SLIDES.length / 2) diff += SLIDES.length;
        const next = prev + diff;
        if (next < SIDE_OFFSET) return SIDE_OFFSET;
        if (next + SIDE_OFFSET >= TRIPLED.length) return TRIPLED.length - 1 - SIDE_OFFSET;
        return next;
      });
      restartAutoPlay();
    },
    [restartAutoPlay]
  );

  useEffect(() => {
    restartAutoPlay();
    return () => {
      clearAutoPlay();
      if (labelTimeoutRef.current !== null) clearTimeout(labelTimeoutRef.current);
    };
  }, [paused, restartAutoPlay, clearAutoPlay]);

  const slidePositions = useMemo(() => {
    const vw =
      typeof window !== "undefined" ? window.innerWidth : 1440;
    const targetActiveX = vw * SCREEN_CENTER_RATIO;

    return VISIBLE_OFFSETS.map((offset) => {
      const i = activeIdx + offset;
      const isActive = offset === 0;
      const absOffset = Math.abs(offset);

      const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.82 : 0.65;
      const blur = absOffset === 0 ? 0 : absOffset === 1 ? 2 : 6;
      const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.85 : 0.5;
      const zIndex = isActive ? 10 : 5 - absOffset;

      const slideX = targetActiveX - SLIDE_W / 2 + offset * PITCH;

      const slide = TRIPLED[wrap(i, TRIPLED.length)];

      return {
        key: `${i}-${slide.category}`,
        slide,
        offset,
        style: {
          transform: `translateX(${slideX}px) translateY(-50%) scale(${scale})`,
          transformOrigin: "center bottom",
          opacity,
          filter: `blur(${blur}px)`,
          zIndex,
          transition: TRANSITION,
        },
        isActive,
      };
    });
  }, [activeIdx]);

  const centerCategory = slidePositions[2].slide.category;

  useLayoutEffect(() => {
    if (centerCategory === prevCenterCategoryRef.current) return;
    prevCenterCategoryRef.current = centerCategory;
    if (labelTimeoutRef.current !== null) clearTimeout(labelTimeoutRef.current);
    setLabelVisible(false);
    labelTimeoutRef.current = setTimeout(() => {
      setLabelVisible(true);
      labelTimeoutRef.current = null;
    }, LABEL_FADE_MS);
  }, [centerCategory]);

  return (
    <section
      className="relative w-full h-[80vh] overflow-hidden select-none border-b-[4px] border-white/60"
      style={{ backgroundColor: "#0a0a0a" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(180,30,30,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Category caption */}
      <div className="absolute top-2 sm:top-5 md:top-8 left-0 right-0 z-20 text-center px-4 pointer-events-none">
        <p className="text-white/60 text-sm sm:text-base md:text-lg font-light tracking-wider uppercase">
          Shop for{" "}
          <span
            className="font-semibold italic normal-case"
            style={{
              color: "#f4a261",
              opacity: labelVisible ? 1 : 0,
              transform: labelVisible ? "translateY(0)" : "translateY(4px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              display: "inline-block",
            }}
          >
            {centerCategory}
          </span>
        </p>
      </div>

      {/* Slide track */}
      <div className="absolute inset-0 overflow-hidden">
        {slidePositions.map(
          (pos) => (
              <div
                key={pos.key}
                style={{
                  position: "absolute",
                  top: "50%",
                  width: SLIDE_W,
                  ...pos.style,
                }}
              >
                <a
                  href={pos.slide.link}
                  className="relative block"
                  style={{ width: SLIDE_W, height: "clamp(340px, 50vh, 460px)" }}
                  draggable={false}
                >
                  {/* Category cutout image — transparent PNG anchored to bottom */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${pos.slide.image})`,
                      backgroundSize: "contain",
                      backgroundPosition: "bottom center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />

                  {/* Podium + glow — only on active slide */}
                  {pos.isActive && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ bottom: "10%", width: "42%", maxWidth: "400px" }}
                    >
                      {/* Ambient glow */}
                      <div
                        className="absolute -top-16 left-1/2 -translate-x-1/2"
                        style={{
                          width: "120%",
                          height: "140px",
                          background:
                            "radial-gradient(ellipse at center, rgba(220,50,50,0.35) 0%, transparent 70%)",
                          filter: "blur(24px)",
                        }}
                      />
                      {/* Podium ellipse */}
                      <div
                        className="w-full rounded-full"
                      />
                      {/* EXPLORE button */}
                      <button className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 mt-4 px-8 py-3 bg-white text-gray-900 text-xs sm:text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-gray-100 transition-colors">
                        Explore
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </a>
              </div>
            )
        )}
      </div>

      {/* Left arrow */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Right arrow */}
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Bottom dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-20 flex justify-center gap-2.5">
        {SLIDES.map((slide, i) => {
          const isActive = activeIdx % SLIDES.length === i;
          return (
            <button
              key={slide.category}
              onClick={() => goToSlide(i)}
              aria-label={`Go to ${slide.category}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: isActive ? "#dc2626" : "rgba(255,255,255,0.3)",
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

CenterFocusCarousel.displayName = "CenterFocusCarousel";
