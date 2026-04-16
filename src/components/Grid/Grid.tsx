import { memo, useMemo } from "react";
import type { GridProps } from "../../types";

/**
 * Grid component - consistent 2 cols mobile, 3 cols desktop
 */
export const Grid = memo(function Grid({ 
  columns = 3, 
  gap = 2,
  children,
  className = ""
}: GridProps): JSX.Element {
  const gridClassName = useMemo(() => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-2 sm:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    };
    const gapMap: Record<number, string> = {
      1: "gap-1",
      2: "gap-1 sm:gap-2",
      3: "gap-1.5 sm:gap-2",
      4: "gap-2",
      5: "gap-2 sm:gap-3",
    };
    return `grid ${colsMap[columns] || "grid-cols-2 sm:grid-cols-3"} ${gapMap[gap] || "gap-1.5"} ${className}`;
  }, [columns, gap, className]);

  return (
    <div className={gridClassName}>
      {children}
    </div>
  );
});
