import { memo, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../Container/Container";
import { TOP_CATEGORIES } from "../../lib/constants";

interface SubCategory {
  label: string;
  link: string;
  image?: string;
}

interface CategorySubCategories {
  [key: string]: SubCategory[];
}

const CATEGORY_SUBCATEGORIES: CategorySubCategories = {
  Eyeglasses: [
    { label: "Rectangle", link: "/search/eyeglasses?shape=rectangle" },
    { label: "Cateye", link: "/search/eyeglasses?shape=cateye" },
    { label: "Aviator", link: "/search/eyeglasses?shape=aviator" },
  ],
  Sunglasses: [
    { label: "Aviator", link: "/search/sunglasses?shape=aviator" },
    { label: "Wayfarer", link: "/search/sunglasses?shape=wayfarer" },
    { label: "Round", link: "/search/sunglasses?shape=round" },
  ],
};

export const TopCategories = memo(function TopCategories(): JSX.Element {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMouseEnter = (categoryName: string) => {
    if (CATEGORY_SUBCATEGORIES[categoryName]) {
      setHoveredCategory(categoryName);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const categoryCards = useMemo(() => (
    TOP_CATEGORIES.map((category) => {
      const hasDropdown = !!CATEGORY_SUBCATEGORIES[category.name];

      return (
        <div
          key={category.name}
          className="relative group w-[33.33%] sm:w-[25%] lg:w-[20%]"
        >
          <Link
            to={category.link}
            className="block"
            onMouseEnter={() => handleMouseEnter(category.name)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Image Card */}
            <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-2">
              <img
                src={category.image}
                alt={category.label}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Badge */}
              {category.badge && (
                <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white bg-blue-600 rounded-full">
                  {category.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span className="text-xs font-medium text-gray-800 group-hover:text-blue-600">
              {category.label}
            </span>
          </Link>

          {/* DROPDOWN */}
          {hasDropdown && hoveredCategory === category.name && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border z-50"
              onMouseEnter={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
            >
              {CATEGORY_SUBCATEGORIES[category.name].map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(sub.link)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  {sub.label}
                </button>
              ))}

              <button
                onClick={() => navigate(category.link)}
                className="w-full py-2 text-sm text-blue-600 border-t"
              >
                View All →
              </button>
            </div>
          )}
        </div>
      );
    })
  ), [hoveredCategory, navigate]);

  return (
    <section className="w-full py-4 bg-white">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">
            Shop by Category
          </h2>
          <Link to="/all-categories" className="text-xs text-blue-600">
            View All
          </Link>
        </div>

        {/* Grid */}
        <div className="flex flex-wrap gap-2">
          {categoryCards}
        </div>
      </Container>
    </section>
  );
});

TopCategories.displayName = "TopCategories";