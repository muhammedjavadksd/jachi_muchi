import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Scroll offset below which the strip counts as sitting on the real edge. */
const EDGE_TOLERANCE_PX = 1;
/** Pointer travel before a press is treated as a drag rather than a click. */
const DRAG_THRESHOLD_PX = 5;
/** Delay between autoplay steps. */
const AUTOPLAY_INTERVAL_MS = 4000;
/**
 * Grace period after a touch before autoplay restarts, so it does not fight the
 * momentum scroll the finger has just produced.
 */
const RESUME_DELAY_MS = 1200;

interface AutoScrollCarouselProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  className?: string;
  /** Accessible name for the scrollable region. */
  ariaLabel?: string;
  /** Set false to keep the strip manually scrollable with no autoplay. */
  autoPlay?: boolean;
}

/**
 * Horizontally scrollable product strip (BUG-009).
 *
 * The previous version was a CSS marquee: the track was a duplicated list moved
 * by an infinite `translateX` keyframe inside an `overflow: hidden` box. That
 * combination is why the strip could not be moved at all - `overflow: hidden`
 * is not a scroll container, and a transform is not a scroll position, so touch,
 * wheel, trackpad and drag all had nowhere to act. It also latched paused: the
 * `:hover` and `:focus-within` rules stopped the animation and the only resume
 * path was `onTouchEnd`, so a cancelled touch or a plain hover left it frozen.
 *
 * This version scrolls natively instead, which gets most of the input handling
 * from the platform rather than from script:
 *   - `overflow-x: auto` + `scroll-snap-type: x mandatory` (see styles.css) gives
 *     momentum swipe on touch and horizontal trackpad panning for free, and keeps
 *     vertical page scrolling over the strip working with no `touch-action` tricks.
 *   - Arrows, autoplay and mouse drag all move the same `scrollLeft`, so they can
 *     never disagree with the native scroll position.
 *   - `canScrollLeft`/`canScrollRight` come from measured scroll geometry, so the
 *     arrows disable only at the genuine ends and a 1-3 item list is inert
 *     instead of broken.
 *   - A ResizeObserver on both viewport and track re-measures after the async
 *     product load, at the sm: card-width breakpoint, and on window resize.
 *   - Autoplay pauses on hover, focus-within and drag (all reversible), loops back
 *     to the first item at the end, and is disabled outright under
 *     prefers-reduced-motion - the request is re-read on change rather than only
 *     at mount.
 */
function AutoScrollCarouselInner<T>({
  items,
  renderCard,
  keyExtractor,
  className = "",
  ariaLabel,
  autoPlay = true,
}: AutoScrollCarouselProps<T>): JSX.Element {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [step, setStep] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const resumeTimerRef = useRef<number | null>(null);
  const dragRef = useRef({ pointerId: -1, startX: 0, startScrollLeft: 0, dragging: false });
  /** Set when a drag ends, so the click it would otherwise fire is swallowed. */
  const justDraggedRef = useRef(false);

  /**
   * Safari can report a negative scrollLeft during overscroll; clamping keeps
   * the edge checks below from reading a negative "at the start" a second time.
   */
  const readScrollLeft = useCallback((): number => {
    const viewport = viewportRef.current;
    return viewport ? Math.max(0, viewport.scrollLeft) : 0;
  }, []);

  const readMaxScroll = useCallback((): number => {
    const viewport = viewportRef.current;
    return viewport ? Math.max(0, viewport.scrollWidth - viewport.clientWidth) : 0;
  }, []);

  const measure = useCallback((): void => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    // Derive the page size from the rendered items rather than the hard-coded
    // card width so it stays right across the sm: breakpoint.
    const first = track.firstElementChild as HTMLElement | null;
    const second = track.children[1] as HTMLElement | undefined;
    let measured = first?.offsetWidth ?? 0;
    if (first && second) {
      const distance = Math.round(
        second.getBoundingClientRect().left - first.getBoundingClientRect().left
      );
      if (distance > 0) measured = distance;
    }
    setStep(measured > 0 ? measured : 0);

    const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const left = Math.max(0, viewport.scrollLeft);
    setCanScrollLeft(left > EDGE_TOLERANCE_PX);
    setCanScrollRight(left < max - EDGE_TOLERANCE_PX);
  }, []);

  // Re-derive the edges on every scroll frame, throttled to one measure per
  // animation frame so a smooth scroll cannot flood React with state updates.
  // Identical booleans bail out of the re-render, so this is near-free.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let frame: number | null = null;
    const handleScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        measure();
      });
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [measure]);

  // Observing both boxes covers the late product load (the track is width:
  // max-content, so added items resize it), the sm: card-width change and window
  // resizes. items.length re-runs it for the one-product case, where the track
  // width does not change but the edges still need to be known.
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const observer = new ResizeObserver(() => measure());
    observer.observe(viewport);
    observer.observe(track);
    measure();
    return () => observer.disconnect();
  }, [measure, items.length]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => setPrefersReducedMotion(query.matches);
    applyPreference();
    query.addEventListener("change", applyPreference);
    return () => query.removeEventListener("change", applyPreference);
  }, []);

  const scrollTo = useCallback(
    (left: number): void => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const target = Math.min(Math.max(0, left), readMaxScroll());
      viewport.scrollTo({
        left: target,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion, readMaxScroll]
  );

  /**
   * One arrow press advances a single product. Falls back to the viewport width
   * before the first measurement lands, so the very first click is not a no-op.
   */
  const scrollByStep = useCallback(
    (direction: 1 | -1): void => {
      const page = step || viewportRef.current?.clientWidth || 1;
      scrollTo(readScrollLeft() + direction * page);
    },
    [readScrollLeft, scrollTo, step]
  );

  const handleScrollPrev = useCallback(() => scrollByStep(-1), [scrollByStep]);
  const handleScrollNext = useCallback(() => scrollByStep(1), [scrollByStep]);

  const isPaused = isHovering || isFocusWithin || isTouching || isDragging;

  // Autoplay is a self-rescheduling timeout rather than an interval so a step
  // can never overlap the next one, and it reads the live scroll position when
  // it fires. It loops back to the first product once the last one is reached.
  useEffect(() => {
    if (!autoPlay || prefersReducedMotion || isPaused) return;
    if (step <= 0) return;

    const timer = window.setTimeout(() => {
      const max = readMaxScroll();
      if (max <= EDGE_TOLERANCE_PX) return;

      const left = readScrollLeft();
      if (left >= max - EDGE_TOLERANCE_PX) {
        scrollTo(0);
      } else {
        scrollTo(left + step);
      }
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [autoPlay, isPaused, prefersReducedMotion, readMaxScroll, readScrollLeft, scrollTo, step]);

  // A native, non-passive wheel listener is required: the rule below only calls
  // preventDefault when it is actually taking over the gesture, and React's
  // onWheel cannot guarantee a cancellable listener.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (event: WheelEvent) => {
      const max = readMaxScroll();
      // Nothing to scroll: leave the gesture to the page.
      if (max <= EDGE_TOLERANCE_PX) return;

      // A trackpad's own horizontal pan is already handled natively by
      // overflow-x: auto, so only a mostly-vertical wheel is redirected here.
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) return;

      const left = readScrollLeft();
      // At the edge in the direction of travel the event is deliberately left
      // alone - that is what keeps vertical page scrolling alive over the strip.
      if (delta > 0 && left >= max - EDGE_TOLERANCE_PX) return;
      if (delta < 0 && left <= EDGE_TOLERANCE_PX) return;

      event.preventDefault();
      viewport.scrollLeft = left + delta;
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [readMaxScroll, readScrollLeft]);

  const clearResumeTimer = useCallback((): void => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearResumeTimer, [clearResumeTimer]);

  const handleTouchStart = useCallback((): void => {
    clearResumeTimer();
    setIsTouching(true);
  }, [clearResumeTimer]);

  // touchcancel matters: the old version only had touchend, so an interrupted
  // gesture left the strip paused with no path back.
  const handleTouchEnd = useCallback((): void => {
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      resumeTimerRef.current = null;
      setIsTouching(false);
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>): void => {
      justDraggedRef.current = false;
      // Touch keeps native momentum scrolling; only mouse and pen get a drag.
      if (event.pointerType === "touch" || event.button !== 0) return;
      if (readMaxScroll() <= EDGE_TOLERANCE_PX) return;
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startScrollLeft: readScrollLeft(),
        dragging: false,
      };
    },
    [readMaxScroll, readScrollLeft]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>): void => {
      const drag = dragRef.current;
      if (drag.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - drag.startX;
      if (!drag.dragging) {
        // Threshold keeps a plain click on a product card working.
        if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;
        drag.dragging = true;
        setIsDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      event.currentTarget.scrollLeft = drag.startScrollLeft - deltaX;
    },
    []
  );

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>): void => {
      if (dragRef.current.pointerId !== event.pointerId) return;
      if (dragRef.current.dragging) {
        justDraggedRef.current = true;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }
      dragRef.current = { pointerId: -1, startX: 0, startScrollLeft: 0, dragging: false };
      setIsDragging(false);
    },
    []
  );

  // A drag that ends over a card would otherwise activate that card's link.
  // The flag is reset on the next pointerdown, so a drag released over empty
  // space can never swallow a later legitimate click.
  const handleClickCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>): void => {
    if (!justDraggedRef.current) return;
    justDraggedRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleMouseEnter = useCallback((): void => setIsHovering(true), []);
  const handleMouseLeave = useCallback((): void => setIsHovering(false), []);
  const handleFocusCapture = useCallback((): void => setIsFocusWithin(true), []);
  const handleBlurCapture = useCallback((): void => setIsFocusWithin(false), []);

  return (
    <div
      ref={viewportRef}
      className={`auto-scroll-viewport relative ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"} ${className}`.trim()}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handlePointerEnd}
      onClickCapture={handleClickCapture}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* First in the DOM so the tab order is region -> arrows -> cards. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-1 sm:px-2">
        <button
          type="button"
          onClick={handleScrollPrev}
          disabled={!canScrollLeft}
          aria-label="Previous products"
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-teal shadow-sm transition-colors hover:bg-teal-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleScrollNext}
          disabled={!canScrollRight}
          aria-label="Next products"
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-teal shadow-sm transition-colors hover:bg-teal-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="auto-scroll-track" ref={trackRef}>
        {items.map((item, index) => (
          <div
            key={keyExtractor(item)}
            className="auto-scroll-item shrink-0 w-[240px] sm:w-[280px] px-2"
          >
            {renderCard(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

type AutoScrollCarouselComponent = (<T>(
  props: AutoScrollCarouselProps<T>
) => JSX.Element) & {
  displayName?: string;
};

/**
 * The cast keeps the generic callable, which memo() on its own would erase, so
 * item type still flows in from `items` at the call site. Without it the
 * displayName assignment below is what fails the type check.
 */
export const AutoScrollCarousel = memo(
  AutoScrollCarouselInner
) as unknown as AutoScrollCarouselComponent;

AutoScrollCarousel.displayName = "AutoScrollCarousel";
