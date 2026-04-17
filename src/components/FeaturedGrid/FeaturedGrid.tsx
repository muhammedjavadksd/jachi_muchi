import { memo, useMemo } from "react";
import { Container } from "../Container/Container";
import type { FeaturedGridProps } from "../../types";

/**
 * Featured Grid - large card + 4 small cards
 */
export const FeaturedGrid = memo(function FeaturedGrid({
  title,
  items,
}: FeaturedGridProps): JSX.Element {

  // First item = big card
  const featuredItem = items[0];

  // Remaining items = grid cards
  const gridCards = useMemo(() => (
    items.slice(1, 5).map((item, index) => (
      <a
        key={index}
        href={item.link}
        className="block overflow-hidden rounded-lg"
      >
        <div className="aspect-[4/3] bg-gray-100">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </a>
    ))
  ), [items]);

  return (
    <section className="w-full bg-white py-3 sm:py-4">
      <Container>
        <h2 className="text-sm sm:text-base font-semibold mb-2 text-gray-900">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">

          {/* ✅ Featured Large Card */}
          {featuredItem && (
            <a
              href={featuredItem.link}
              className="block overflow-hidden rounded-lg sm:row-span-2"
            >
              <img
                src={featuredItem.image}
                alt={featuredItem.title}
                className="w-full h-48 sm:h-full object-cover"
                loading="lazy"
              />
            </a>
          )}

          {/* ✅ Small Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {gridCards}
          </div>

        </div>
      </Container>
    </section>
  );
});

FeaturedGrid.displayName = "FeaturedGrid";