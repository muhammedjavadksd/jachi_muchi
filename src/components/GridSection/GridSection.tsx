import { memo } from "react";
import { Container } from "../Container/Container";
import { Grid } from "../Grid/Grid";
import { ImageCard } from "../ImageCard/ImageCard";
import type { GridSectionProps } from "../../types";

/**
 * Reusable grid section for displaying image cards
 * Accepts title, columns, and items as props for flexibility
 * Memoized to prevent unnecessary re-renders
 */
export const GridSection = memo(function GridSection({
  title,
  columns = 3,
  gap = 5,
  items,
}: GridSectionProps): JSX.Element {
  return (
    <section
      className="w-full bg-white"
      style={{ paddingTop: "48px", paddingBottom: "48px" }}
    >
      <Container>
      <h2
          className="font-semibold mb-3"
          style={{ fontSize: "30px", color: "#1a1a1a" }}
        >
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
