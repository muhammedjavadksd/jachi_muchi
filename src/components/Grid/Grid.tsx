import { memo, useMemo } from "react";
import type { GridProps } from "../../types";

/**
 * Reusable Grid component for creating responsive grid layouts
 * Accepts columns prop to define items per row
 * Memoized to prevent unnecessary re-renders
 */
export const Grid = memo(function Grid({ 
  columns = 3, 
  gap = 5,
  children,
  className = ""
}: GridProps): JSX.Element {
  /** Memoize grid style based on columns prop */
  const gridClassName = useMemo(() => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6",
    };
    const gapMap: Record<number, string> = {
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
    };
    return `grid ${colsMap[columns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"} ${gapMap[gap] || "gap-5"} ${className}`;
  }, [columns, gap, className]);

  return (
    <div className={gridClassName}>
      {children}
    </div>
  );
});

Grid.displayName = "Grid";
