import { memo, useMemo } from "react";
import type { ContainerProps } from "../../types";

/**
 * Container component - Lenskart-style with consistent padding
 */
export const Container = memo(function Container({ 
  children, 
  className = "" 
}: ContainerProps): JSX.Element {
  const combinedClassName = useMemo(() => (
    `w-full max-w-[1400px] mx-auto px-3 ${className}`
  ), [className]);

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
});

Container.displayName = "Container";
