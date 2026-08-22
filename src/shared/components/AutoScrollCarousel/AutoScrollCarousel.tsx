import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

interface AutoScrollCarouselProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  className?: string;
}

function AutoScrollCarouselInner<T>({
  items,
  renderCard,
  keyExtractor,
  className = "",
}: AutoScrollCarouselProps<T>): JSX.Element {
  const [paused, setPaused] = useState(false);
  const resumeTimeout = useRef<number | null>(null);

  /** A loop needs at least two cards to scroll into; below that render statically */
  const shouldAnimate = items.length >= 2;
  /** Speed scales with list length, clamped to keep a consistent feel */
  const duration = Math.min(Math.max(items.length * 3, 15), 60);

  const handleTouchStart = useCallback(() => {
    if (resumeTimeout.current !== null) {
      window.clearTimeout(resumeTimeout.current);
      resumeTimeout.current = null;
    }
    setPaused(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (resumeTimeout.current !== null) {
      window.clearTimeout(resumeTimeout.current);
    }
    resumeTimeout.current = window.setTimeout(() => {
      setPaused(false);
      resumeTimeout.current = null;
    }, 1500);
  }, []);

  useEffect(
    () => () => {
      if (resumeTimeout.current !== null) {
        window.clearTimeout(resumeTimeout.current);
      }
    },
    []
  );

  return (
    <div
      className={`auto-scroll-viewport ${paused ? "paused" : ""} ${className}`.trim()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="auto-scroll-track"
        style={
          {
            "--auto-scroll-duration": `${duration}s`,
            ...(shouldAnimate ? {} : { animation: "none" }),
          } as React.CSSProperties
        }
      >
        {items.map((item, index) => (
          <div
            key={`${keyExtractor(item)}-a`}
            className="shrink-0 w-[240px] sm:w-[280px] px-2"
          >
            {renderCard(item, index)}
          </div>
        ))}
        {shouldAnimate &&
          items.map((item, index) => (
            <div
              key={`${keyExtractor(item)}-b`}
              className="shrink-0 w-[240px] sm:w-[280px] px-2"
              aria-hidden="true"
            >
              {renderCard(item, index)}
            </div>
          ))}
      </div>
    </div>
  );
}

export const AutoScrollCarousel = memo(
  AutoScrollCarouselInner
) as typeof AutoScrollCarouselInner;

AutoScrollCarousel.displayName = "AutoScrollCarousel";
