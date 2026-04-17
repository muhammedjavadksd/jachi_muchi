import { memo, useMemo } from "react";
import type { ContainerProps } from "../../types";

/**
 * Container component - responsive and flexible
 */
export const Container = memo(function Container({ 
  children, 
  className = "" 
}: ContainerProps): JSX.Element {

  const combinedClassName = useMemo(() => (
    `w-full max-w-[1400px] mx-auto overflow-visible px-3 sm:px-4 md:px-6 lg:px-12 ${className}`
  ), [className]);

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
});

Container.displayName = "Container";