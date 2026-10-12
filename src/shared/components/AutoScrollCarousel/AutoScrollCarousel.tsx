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
import { useAutoScroll } from "@/shared/hooks/useAutoScroll";
import {
  AUTO_SCROLL_ARROW_PAUSE_MS,
  AUTO_SCROLL_ITEM_SELECTOR,
  AUTO_SCROLL_TRACK_SELECTOR,
  AUTO_SCROLL_WHEEL_PAUSE_MS,
} from "@/shared/constants";

/** Scroll offset below which the strip counts as sitting on the real edge. */
const EDGE_TOLERANCE_PX = 1;
/** Pointer travel before a press is treated as a drag rather than a click. */
const DRAG_THRESHOLD_PX = 5;

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
 *   - `overflow-x: auto` (see styles.css) gives momentum swipe on touch and
 *     horizontal trackpad panning for free, and keeps vertical page scrolling
 *     over the strip working with no `touch-action` tricks. Snapping is
 *     intentionally omitted so the autoplay's smooth scroll does not jump.
 *   - Arrows, autoplay and mouse drag all move the same `scrollLeft`, so they can
 *     never disagree with the native scroll position. The arrows sit outside the
 *     scroller, in a `relative` wrapper, so they stay fixed while cards move.
 *   - `canScrollLeft`/`canScrollRight` come from measured scroll geometry, so the
 *     arrows disable only at the genuine ends and a 1-3 item list is inert
 *     instead of broken.
 *   - A ResizeObserver on both viewport and track re-measures after the async
 *     product load, at the sm: card-width breakpoint, and on window resize.
 *   - Autoplay (from `useAutoScroll`) pauses briefly after any interaction -
 *     pointer movement (2s), touch (4s), wheel (4s) and an arrow press (4s) -
 *     and while the tab is hidden, then resumes on its own. Pausing is
 *     timestamp-based, so a missed leave/blur event can never latch it paused,
 *     and reduced motion only swaps the scroll animation, never the autoplay.
 */
function AutoScrollCarouselInner<T>({
  items,
  renderCard,
  keyExtractor,
  className = "",
  ariaLabel,
  autoPlay = true,
}: AutoScrollCarouselProps<T>): JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [step, setStep] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const autoScroll = useAutoScroll<HTMLDivElement>({
    enabled: autoPlay,
    paused: isDragging,
    trackSelector: AUTO_SCROLL_TRACK_SELECTOR,
    itemSelector: AUTO_SCROLL_ITEM_SELECTOR,
    revision: items.length,
  });
  const viewportRef = autoScroll.ref;
  const { pauseFor } = autoScroll;

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

  /**
   * One card's horizontal advance: the distance between the first two product
   * cards (card 2 `offsetLeft` minus card 1 `offsetLeft`, i.e. card width + gap).
   * Reading the cards by their item marker keeps the arrow buttons - now
   * siblings of the scroller - out of the math entirely, and `offsetLeft` is a
   * layout value, so it is unaffected by the current scroll position.
   */
  const readCardStep = useCallback((): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(AUTO_SCROLL_ITEM_SELECTOR));
    if (cards.length > 1) {
      const distance = cards[1].offsetLeft - cards[0].offsetLeft;
      if (distance > 0) return distance;
    }
    if (cards.length === 1) return cards[0].offsetWidth;
    return 0;
  }, []);

  const measure = useCallback((): void => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measured = readCardStep();
    setStep(measured > 0 ? measured : 0);

    const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const left = Math.max(0, viewport.scrollLeft);
    setCanScrollLeft(left > EDGE_TOLERANCE_PX);
    setCanScrollRight(left < max - EDGE_TOLERANCE_PX);
  }, [readCardStep]);

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
   * One arrow press advances exactly one product. The step is the live card
   * pitch (`card 2 offsetLeft - card 1 offsetLeft`); the viewport width is only
   * a last-resort fallback if the cards cannot be measured yet, so the very
   * first click is never a no-op.
   */
  const scrollByStep = useCallback(
    (direction: 1 | -1): void => {
      const page = readCardStep() || step || viewportRef.current?.clientWidth || 1;
      scrollTo(readScrollLeft() + direction * page);
    },
    [readCardStep, readScrollLeft, scrollTo, step]
  );

  const handleScrollPrev = useCallback((): void => {
    pauseFor(AUTO_SCROLL_ARROW_PAUSE_MS);
    scrollByStep(-1);
  }, [pauseFor, scrollByStep]);
  const handleScrollNext = useCallback((): void => {
    pauseFor(AUTO_SCROLL_ARROW_PAUSE_MS);
    scrollByStep(1);
  }, [pauseFor, scrollByStep]);

  // A native, non-passive wheel listener is required: the rule below only calls
  // preventDefault when it is actually taking over the gesture, and React's
  // onWheel cannot guarantee a cancellable listener.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (event: WheelEvent) => {
      pauseFor(AUTO_SCROLL_WHEEL_PAUSE_MS);
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
  }, [pauseFor, readMaxScroll, readScrollLeft]);

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

  return (
    <div className="relative">
      <div
        ref={viewportRef}
        className={`auto-scroll-viewport ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"} ${className}`.trim()}
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
        {...autoScroll.handlers}
      >
        <div className="auto-scroll-track" ref={trackRef}>
          {items.map((item, index) => (
            <div
              key={keyExtractor(item)}
              data-auto-scroll-item
              className="shrink-0 w-[240px] sm:w-[280px] px-2"
            >
              {renderCard(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows are siblings of the scroller (inside this relative wrapper), so
          they stay fixed at the edges while the cards scroll underneath. */}
      <button
        type="button"
        onClick={handleScrollPrev}
        disabled={!canScrollLeft}
        aria-label="Previous products"
        className="absolute left-2 top-[40%] -translate-y-1/2 z-10 pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-teal shadow-sm transition-colors hover:bg-teal-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={handleScrollNext}
        disabled={!canScrollRight}
        aria-label="Next products"
        className="absolute right-2 top-[40%] -translate-y-1/2 z-10 pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-teal shadow-sm transition-colors hover:bg-teal-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
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
