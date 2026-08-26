import { memo, useMemo } from "react";
import type { ContainerProps } from "@/shared/types";

/**
 * Shared page container for consistent section alignment across the app.
 * Fluid width up to a 1560px cap centered via mx-auto, so wide desktops get
 * large side margins (~180px at 1920px viewport) while tablet/mobile scale
 * down proportionally. Inner horizontal padding keeps content off the
 * viewport edge below the cap (16px mobile -> 24px md+).
 * Memoized as it's used frequently across the app.
 */
export const Container = memo(function Container({
  children,
  className = ""
}: ContainerProps): JSX.Element {
  /** Memoize combined className to prevent recalculation */
  const combinedClassName = useMemo(() => (
    `w-full max-w-[1560px] mx-auto px-4 sm:px-5 md:px-6 ${className}`
  ), [className]);

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
});

Container.displayName = "Container";
