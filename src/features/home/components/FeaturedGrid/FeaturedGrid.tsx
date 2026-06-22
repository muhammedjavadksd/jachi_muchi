import { memo, useMemo } from "react";
import { Container } from "@/shared/components/Container/Container";
import type { FeaturedGridProps } from "@/features/home/types";

export const FeaturedGrid = memo(function FeaturedGrid({
  title,
  items,
}: FeaturedGridProps): JSX.Element {
  const featuredItem = items[0];
  const gridItems = items.slice(1, 5);

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

          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {gridCards}
          </div>
        </div>
      </Container>
    </section>
  );
});

FeaturedGrid.displayName = "FeaturedGrid";

