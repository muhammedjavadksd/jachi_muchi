import { memo } from "react";
import { Container } from "../Container/Container";
import type { FeaturedGridProps } from "../../types";

/**
 * Featured Grid - 2x2 on mobile, 4 cols on desktop
 */
export const FeaturedGrid = memo(function FeaturedGrid({
  title,
  items,
}: FeaturedGridProps): JSX.Element {
  return (
    <section className="w-full bg-white py-3 sm:py-4">
      <Container>
        <h2 className="text-sm sm:text-base font-semibold mb-2 text-gray-900">
          {title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {items.slice(0, 4).map((item, index) => (
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
          ))}
        </div>
      </Container>
    </section>
  );
});

FeaturedGrid.displayName = "FeaturedGrid";
