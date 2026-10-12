import type { ReactNode, RefObject } from "react";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: number;
  columns?: number;
  gap?: number;
}

export interface ImageCardProps {
  src?: string;
  image?: string;
  alt?: string;
  className?: string;
  link?: string;
  borderRadius?: string;
}

export interface ColorVariant {
  colorCode: string;
  image: string;
}

export interface IconProps {
  className?: string;
  width?: number;
  height?: number;
  stroke?: string;
}

export interface UseSliderReturn {
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
}

export interface UseAutoScrollOptions {
  /** Delay between automatic steps, in milliseconds. Defaults to 3000. */
  delay?: number;
  /** Set false to keep the strip manually scrollable with no autoplay. */
  enabled?: boolean;
  /** External pause (e.g. while the user is dragging) layered on top of the
   * timed pointer/touch/wheel pauses. */
  paused?: boolean;
  /** Element the hook measures the card step from. Falls back to the first child. */
  trackSelector?: string;
  /** Item elements the hook measures the card step between. Falls back to the track's children. */
  itemSelector?: string;
  /** Bump this (e.g. `items.length`) to force a re-measure when the contents change. */
  revision?: number;
}

export interface AutoScrollHandlers {
  onMouseMove: () => void;
  onTouchStart: () => void;
}

export interface UseAutoScrollReturn<T extends HTMLElement = HTMLDivElement> {
  ref: RefObject<T>;
  handlers: AutoScrollHandlers;
  /** Pause autoplay for `ms` milliseconds (e.g. after a manual arrow press). */
  pauseFor: (ms: number) => void;
}

export interface SearchResult {
  suggestions: string[];
  categories: string[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

export interface PopularEyewearItem {
  name: string;
  desc: string;
}
