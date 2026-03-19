import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
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
      <Link
        key={index}
        to={category.link}
        className="flex flex-col items-stretch gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
      >
        {/* Card Container (keeps existing design) */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: "16px",
            aspectRatio: "1 / 0.7",
          }}
        >
          <img
            src={category.image}
            alt={category.label}
            className="w-4/5 h-4/5 object-contain"
            loading="lazy"
          />
          {category.badge && (
            <span
              className="absolute bottom-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: "#146eb4" }}
            >
              {category.badge}
            </span>
          )}
        </div>

        <span
          className="text-center font-medium text-xs sm:text-sm md:text-base leading-tight"
          style={{ color: "darkgoldenrod" }}
        >
          {category.label}
        </span>
      </Link>
    ))
  ), []);

  return (
    <section className="w-full py-12">
      <Container>
        <h2 className="text-xl sm:text-2xl md:text-[30px] font-semibold mb-4 text-[#1a1a1a]">
          Top Categorie
        </h2>

        {/* Parent scroll container */}
        <div className="w-full overflow-x-auto scrollbar-hide scroll-smooth">
          {/* Single row flex container */}
          <div className="flex flex-nowrap gap-3 sm:gap-4 md:gap-5 w-full max-w-full">
            {TOP_CATEGORIES.map((category, i) => (
              <div
                key={category.name}
                className="flex-shrink-0 w-[25%] sm:w-[20%] lg:w-[16.66%]"
              >
                {categoryCards[i]}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
});

TopCategories.displayName = "TopCategories";
