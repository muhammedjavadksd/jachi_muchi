import { memo, useMemo } from "react";
import { Container } from "../Container/Container";
import type { FeaturedGridProps } from "../../types";

/**
 * Featured grid section with one large card and multiple smaller cards
 * Layout: Large card on left (2 rows), 2x2 grid on right
 * Memoized to prevent unnecessary re-renders
 */
export const FeaturedGrid = memo(function FeaturedGrid({
  title,
  items,
}: FeaturedGridProps): JSX.Element {
  /** First item is the featured/large card */
  const featuredItem = items[0];
  /** Rest of the items go in the 2x2 grid */
  const gridItems = items.slice(1, 5);

  /** Memoize grid items to prevent recreation */
  const gridCards = useMemo(() => (
    gridItems.map((item, index) => (
      <a
        key={index}
        href={item.link}
        className="relative block overflow-hidden group"
        style={{ borderRadius: "16px" }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Arrow Button */}
        
      </a>
    ))
  ), [gridItems]);

  return (
    <section
      className="w-full bg-white"
      style={{ paddingTop: "48px", paddingBottom: "48px" }}
    >
      <Container>
        <h2
          className="font-semibold mb-8"
          style={{ fontSize: "24px", color: "#1a1a1a" }}
        >
          {title}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
          {/* Featured Large Card - Left Side */}
          <a
            href={featuredItem.link}
            className="relative block overflow-hidden row-span-1 sm:row-span-2"
            style={{ borderRadius: "16px" }}
          >
            <img
              src={featuredItem.image}
              alt={featuredItem.title}
              className="w-full h-48 sm:h-full object-cover"
              loading="lazy"
            />
            
          </a>

          {/* Right Side - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {gridCards}
          </div>
        </div>
      </Container>
    </section>
  );
});

FeaturedGrid.displayName = "FeaturedGrid";
