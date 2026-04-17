import { memo } from "react";
import { Container } from "../Container/Container";
import { Grid } from "../Grid/Grid";
import { ImageCard } from "../ImageCard/ImageCard";
import type { GridSectionProps } from "../../types";

/**
 * Grid section - consistent spacing
 */
export const GridSection = memo(function GridSection({
  title,
  columns = 3,
  gap = 2,
  items,
}: GridSectionProps): JSX.Element {
  return (
    <section className="w-full bg-white py-3 sm:py-4">
      <Container>
        <h2 className="text-sm sm:text-base font-semibold mb-2 text-gray-900">
          {title}
        </h2>
        <Grid columns={columns} gap={gap}>
          {items.map((item, index) => (
            <ImageCard
              key={index}
              image={item.image}
              alt={item.title}
              link={item.link}
            />
          ))}
        </Grid>
      </Container>
    </section>
  );
});

GridSection.displayName = "GridSection";
