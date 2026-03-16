import { useState, useCallback, useMemo } from "react";
import type { UseSliderReturn } from "../types";

/**
 * Custom hook for managing slider/carousel state
 * Provides current slide index and navigation functions
 * All navigation functions are memoized with useCallback
 * 
 * @param totalSlides - Total number of slides in the carousel
 * @returns Object containing current slide and navigation handlers
 */
export function useSlider(totalSlides: number): UseSliderReturn {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  /** Memoized function to go to next slide with wrap-around */
  const nextSlide = useCallback((): void => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  /** Memoized function to go to previous slide with wrap-around */
  const prevSlide = useCallback((): void => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  /** Memoized function to go to a specific slide */
  const goToSlide = useCallback((index: number): void => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  /** Memoize return object to prevent unnecessary re-renders in consumers */
  return useMemo(() => ({
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
  }), [currentSlide, nextSlide, prevSlide, goToSlide]);
}
