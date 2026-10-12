import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  AUTO_SCROLL_ANIMATION_MS,
  AUTO_SCROLL_DEFAULT_DELAY_MS,
  AUTO_SCROLL_EDGE_TOLERANCE_PX,
  AUTO_SCROLL_MOUSE_MOVE_PAUSE_MS,
  AUTO_SCROLL_TOUCH_PAUSE_MS,
} from "@/shared/constants";
import type { AutoScrollHandlers, UseAutoScrollOptions, UseAutoScrollReturn } from "@/shared/types";

/**
 * Automatic horizontal carousel scrolling.
 *
 * Steps one card at a time on a fixed delay and loops smoothly back to the
 * first card once the last one is reached. The step is measured from the two
 * left-most cards (width + gap) rather than a hard-coded pixel value, so it
 * stays correct at every breakpoint and the arrow buttons never enter the math.
 *
 * Pausing is time-based, not state-based. An interaction records a
 * `pausedUntil` timestamp and the tick compares `Date.now()` against it, so
 * there is no React state that a missed `mouseleave`/`blur`/`touchend` (the
 * element scrolling out from under a still cursor, a tab switch, a lost
 * pointer, a click-focused arrow) can strand at `true` and freeze autoplay
 * forever. A single interval lives for the whole `enabled`/`delay` lifetime and
 * every tick re-reads the live element, step and pause refs, so no re-render can
 * tear it down or restart it. Autoplay is skipped while the tab is hidden and is
 * never disabled outright - reduced motion only changes the scroll animation.
 *
 * @param options.delay - Delay between steps in ms (default 3000).
 * @param options.enabled - Set false to disable autoplay entirely.
 * @param options.paused - External pause (e.g. while dragging) layered on top of
 *   the timed pointer/touch pauses.
 * @returns `ref` to attach to the scroll container, `handlers` to spread on it,
 *   and `pauseFor` to pause autoplay after a manual action such as an arrow press.
 */
export function useAutoScroll<T extends HTMLElement = HTMLDivElement>({
  delay = AUTO_SCROLL_DEFAULT_DELAY_MS,
  enabled = true,
  paused = false,
  trackSelector,
  itemSelector,
  revision = 0,
}: UseAutoScrollOptions = {}): UseAutoScrollReturn<T> {
  const ref = useRef<T>(null);
  const stepRef = useRef<number>(0);
  const pausedUntilRef = useRef<number>(0);
  const prefersReducedMotionRef = useRef<boolean>(false);
  const pausedRef = useRef<boolean>(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const getTrack = useCallback((): HTMLElement | null => {
    const container = ref.current;
    if (!container) return null;
    if (trackSelector) return container.querySelector<HTMLElement>(trackSelector);
    return container.firstElementChild as HTMLElement | null;
  }, [trackSelector]);

  /**
   * Derive the page size from the rendered cards (distance between the first
   * two card origins equals card width + gap). The arrow buttons live outside
   * the track (and are excluded below as a belt-and-braces measure), so they
   * can never be mistaken for a card.
   */
  const measureStep = useCallback((): void => {
    const track = getTrack();
    if (!track) return;

    const cards = itemSelector
      ? Array.from(track.querySelectorAll<HTMLElement>(itemSelector))
      : (Array.from(track.children) as HTMLElement[]).filter(
          (child) => !(child instanceof HTMLButtonElement)
        );

    if (cards.length === 0) {
      stepRef.current = 0;
      return;
    }

    let measured = cards[0].offsetWidth;
    if (cards.length > 1) {
      const distance = Math.round(
        cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left
      );
      if (distance > 0) measured = distance;
    }
    stepRef.current = measured > 0 ? measured : 0;
  }, [getTrack, itemSelector]);

  const scrollTo = useCallback((left: number): void => {
    const container = ref.current;
    if (!container) return;
    const max = Math.max(0, container.scrollWidth - container.clientWidth);
    const target = Math.min(Math.max(0, left), max);
    container.scrollTo({
      left: target,
      behavior: prefersReducedMotionRef.current ? "auto" : "smooth",
    });
  }, []);

  // Observing the container and the track covers the late product load (the
  // track resizes as cards arrive), the responsive card-width change and window
  // resizes. `revision` re-runs it when the track itself is swapped in.
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const observer = new ResizeObserver(() => measureStep());
    observer.observe(container);
    const track = getTrack();
    if (track) observer.observe(track);
    measureStep();
    return () => observer.disconnect();
  }, [getTrack, measureStep, revision]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = (): void => {
      prefersReducedMotionRef.current = query.matches;
    };
    applyPreference();
    query.addEventListener("change", applyPreference);
    return () => query.removeEventListener("change", applyPreference);
  }, []);

  const pauseFor = useCallback((ms: number): void => {
    const until = Date.now() + ms;
    if (until > pausedUntilRef.current) pausedUntilRef.current = until;
  }, []);

  const handleMouseMove = useCallback((): void => {
    pauseFor(AUTO_SCROLL_MOUSE_MOVE_PAUSE_MS);
  }, [pauseFor]);

  const handleTouchStart = useCallback((): void => {
    pauseFor(AUTO_SCROLL_TOUCH_PAUSE_MS);
  }, [pauseFor]);

  const handlers = useMemo<AutoScrollHandlers>(
    () => ({ onMouseMove: handleMouseMove, onTouchStart: handleTouchStart }),
    [handleMouseMove, handleTouchStart]
  );

  // One interval for the life of `enabled`/`delay`; nothing inside depends on a
  // render, so a pause can never clear or restart it and StrictMode's
  // double-invoked effect still leaves exactly one interval running.
  useEffect(() => {
    if (!enabled) return;

    const intervalId = window.setInterval(() => {
      if (document.hidden) return;
      if (pausedRef.current) return;
      if (Date.now() < pausedUntilRef.current) return;

      const container = ref.current;
      if (!container) return;

      const max = Math.max(0, container.scrollWidth - container.clientWidth);
      if (max <= AUTO_SCROLL_EDGE_TOLERANCE_PX) return;

      const step = stepRef.current;
      if (step <= 0) return;

      const left = Math.max(0, container.scrollLeft);
      if (left >= max - AUTO_SCROLL_EDGE_TOLERANCE_PX) {
        scrollTo(0);
      } else {
        scrollTo(left + step);
      }
    }, delay);

    return () => window.clearInterval(intervalId);
  }, [delay, enabled, scrollTo]);

  return useMemo(() => ({ ref, handlers, pauseFor }), [handlers, pauseFor]);
}
