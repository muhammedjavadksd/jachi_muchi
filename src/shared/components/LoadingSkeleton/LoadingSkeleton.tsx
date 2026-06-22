import { memo } from "react";

/**
 * Skeleton loading placeholder component
 * Displays animated placeholder blocks while content loads
 * Memoized as it has no props that change
 */
export const LoadingSkeleton = memo(function LoadingSkeleton(): JSX.Element {
  return (
    <div className="w-full py-12 px-12">
      {/* Title skeleton */}
      <div className="h-6 w-48 bg-gray-200 rounded-md mb-8 animate-pulse" />
      
      {/* Content skeleton - grid of cards */}
      <div className="grid grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            {/* Card skeleton */}
            <div 
              className="w-full bg-gray-200 rounded-2xl animate-pulse"
              style={{ aspectRatio: "1 / 0.7" }}
            />
            {/* Label skeleton */}
            <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
});

LoadingSkeleton.displayName = "LoadingSkeleton";
