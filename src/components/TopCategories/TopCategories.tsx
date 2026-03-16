import { memo, useMemo } from "react";
import { Container } from "../Container/Container";
import { TOP_CATEGORIES } from "../../lib/constants";

/**
 * Top Categories section displaying clickable category cards
 * Shows product categories with images and optional badges
 * Memoized as content is static
 */
export const TopCategories = memo(function TopCategories(): JSX.Element {
  /** Memoize category cards to prevent recreation on re-render */
  const categoryCards = useMemo(() => (
    TOP_CATEGORIES.map((category, index) => (
      <div key={index} className="flex flex-col items-center gap-4">
        {/* Card Container */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: "16px",
            width: "100%",
            aspectRatio: "1 / 0.7",
          }}
        >
          {/* Category Image */}
          <img
            src={category.image}
            alt={category.label}
            className="w-4/5 h-4/5 object-contain"
            loading="lazy"
          />
          {/* Sale Badge */}
          {category.badge && (
            <span
              className="absolute bottom-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: "#146eb4" }}
            >
              {category.badge}
            </span>
          )}
        </div>
        {/* Category Label */}
        <span
          className="text-center font-medium"
          style={{ color: "darkgoldenrod", fontSize: "20px" }}
        >
          {category.label}
        </span>
      </div>
    ))
  ), []);

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
          Top Categorie
        </h2>
        <div className="grid grid-cols-6 gap-6">
          {categoryCards}
        </div>
      </Container>
    </section>
  );
});

TopCategories.displayName = "TopCategories";
