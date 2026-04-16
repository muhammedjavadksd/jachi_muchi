import { memo, useMemo } from "react";
import type { ContainerProps } from "../../types";

/** Constant padding style to avoid recreation */
const CONTAINER_PADDING_STYLE = { paddingLeft: "12px", paddingRight: "12px" };

/**
 * Container component for consistent page layout
 * Provides 48px padding on left and right with max-width 1400px, centered
 * Memoized as it's used frequently across the app
 */
export const Container = memo(function Container({ 
  children, 
  className = "" 
}: ContainerProps): JSX.Element {
  /** Memoize combined className to prevent recalculation */
  const combinedClassName = useMemo(() => (
    `w-full max-w-[1400px] mx-auto overflow-visible px-3 sm:px-4 md:px-6 lg:px-12 ${className}`
  ), [className]);

  return (
    <div
      className={combinedClassName}
      style={CONTAINER_PADDING_STYLE}
    >
      {children}
    </div>
  );
});

Container.displayName = "Container";
