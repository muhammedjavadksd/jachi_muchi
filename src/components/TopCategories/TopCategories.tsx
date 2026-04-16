import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container } from "../Container/Container";
import { TOP_CATEGORIES } from "../../lib/constants";

/**
 * Category Cards - Lenskart style with human model photos
 * Background image with category label below
 */
export const TopCategories = memo(function TopCategories(): JSX.Element {
  const categoryCards = useMemo(() => (
    TOP_CATEGORIES.map((category, index) => (
      <Link
        key={index}
        to={category.link}
        className="group block"
      >
        {/* Card with model photo background */}
        <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-2">
          <img
            src={category.image}
            alt={category.label}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
          {/* Badge */}
          {category.badge && (
            <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white bg-blue-600 rounded-full">
              {category.badge}
            </span>
          )}
        </div>
        {/* Category label */}
        <span className="text-xs font-medium text-gray-800 group-hover:text-blue-600">
          {category.label}
        </span>
      </Link>
    ))
  ), []);

  return (
    <section className="w-full py-4 bg-white">
      <Container>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">
            Shop by Category
          </h2>
          <Link to="/all-categories" className="text-xs text-blue-600 font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {categoryCards}
        </div>
      </Container>
    </section>
  );
});

TopCategories.displayName = "TopCategories";
