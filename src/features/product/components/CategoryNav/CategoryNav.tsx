import { memo, useMemo } from "react";
import { Container } from "@/shared/components/Container/Container";
import type { CategoryNavProps } from "@/features/product/types";

export const CategoryNav = memo(function CategoryNav({
  categories,
  activeCategory,
}: CategoryNavProps): JSX.Element {
  const categoryLinks = useMemo(() => (
    categories.map((category) => (
      <a
        key={category.id}
        href={category.link}
        className={`text-sm font-medium whitespace-nowrap transition-colors ${
          activeCategory === category.id
            ? "text-teal-700 border-b-2 border-teal-700 pb-3"
            : "text-gray-600 hover:text-gray-900 pb-3"
        }`}
      >
        {category.label}
      </a>
    ))
  ), [categories, activeCategory]);

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <Container>
        <div className="flex items-center gap-8 py-3 overflow-x-auto">
          {categoryLinks}
        </div>
      </Container>
    </nav>
  );
});

CategoryNav.displayName = "CategoryNav";

