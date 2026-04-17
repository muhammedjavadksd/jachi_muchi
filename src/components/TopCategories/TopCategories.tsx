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
  "Eyeglasses": [
    { label: "Rectangle", link: "/search/eyeglasses?shape=rectangle", image: "/category/image.png" },
    { label: "Cateye", link: "/search/eyeglasses?shape=cateye", image: "/category/image.png" },
    { label: "Aviator", link: "/search/eyeglasses?shape=aviator", image: "/category/image.png" },
    { label: "Geometric", link: "/search/eyeglasses?shape=geometric", image: "/category/image.png" },
    { label: "Round", link: "/search/eyeglasses?shape=round", image: "/category/image.png" },
    { label: "Clubmaster", link: "/search/eyeglasses?shape=clubmaster", image: "/category/image.png" },
  ],
  "Sunglasses": [
    { label: "Aviator", link: "/search/sunglasses?shape=aviator", image: "/category/image.png" },
    { label: "Wayfarer", link: "/search/sunglasses?shape=wayfarer", image: "/category/image.png" },
    { label: "Round", link: "/search/sunglasses?shape=round", image: "/category/image.png" },
    { label: "Rectangle", link: "/search/sunglasses?shape=rectangle", image: "/category/image.png" },
    { label: "Clubmaster", link: "/search/sunglasses?shape=clubmaster", image: "/category/image.png" },
    { label: "Sports", link: "/search/sunglasses?shape=sports", image: "/category/image.png" },
  ],
  "Special Power": [
    { label: "Bifocal", link: "/search/special-power?type=bifocal", image: "/category/image.png" },
    { label: "Progressive", link: "/search/special-power?type=progressive", image: "/category/image.png" },
    { label: "Single Vision", link: "/search/special-power?type=single-vision", image: "/category/image.png" },
    { label: "Reading Glasses", link: "/search/reading-glasses", image: "/category/image.png" },
    { label: "Computer Glasses", link: "/search/computer-glasses", image: "/category/image.png" },
  ],
  "Contact Lenses": [
    { label: "Daily Disposables", link: "/search/contact-lenses?type=daily", image: "/category/image.png" },
    { label: "Monthly Lenses", link: "/search/contact-lenses?type=monthly", image: "/category/image.png" },
    { label: "Color Contacts", link: "/search/contact-lenses?type=color", image: "/category/image.png" },
    { label: "Toric Lenses", link: "/search/contact-lenses?type=toric", image: "/category/image.png" },
    { label: "Solution", link: "/search/solution", image: "/category/image.png" },
  ],
  "Kids Glasses": [
    { label: "0-3 Years", link: "/search/kids-glasses?age=0-3", image: "/category/image.png" },
    { label: "4-8 Years", link: "/search/kids-glasses?age=4-8", image: "/category/image.png" },
    { label: "9-12 Years", link: "/search/kids-glasses?age=9-12", image: "/category/image.png" },
    { label: "Teen", link: "/search/kids-glasses?age=teen", image: "/category/image.png" },
    { label: "Blue Light Kids", link: "/search/kids-glasses?blue-light=true", image: "/category/image.png" },
  ],
  "Sale": [
    { label: "Upto 50% Off", link: "/search/sale?discount=50", image: "/category/image.png" },
    { label: "Buy 1 Get 1", link: "/search/sale?offer=bog", image: "/category/image.png" },
    { label: "Clearance", link: "/search/sale?type=clearance", image: "/category/image.png" },
    { label: "Student Discount", link: "/search/sale?discount=student", image: "/category/image.png" },
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
        <div key={category.name} className="relative group">
          <Link
            to={category.link}
            className="flex flex-col items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
            onMouseEnter={() => handleMouseEnter(category.name)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="relative flex items-center justify-center overflow-hidden w-full"
              style={{ backgroundColor: "#f6f6f6", borderRadius: "16px", aspectRatio: "1 / 0.7" }}
            >
              <img src={category.image} alt={category.label} className="w-4/5 h-4/5 object-contain" loading="lazy" />
              {category.badge && (
                <span className="absolute bottom-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: "#146eb4" }}>
                  {category.badge}
                </span>
              )}
            </div>
            <span className="text-center font-medium text-xs sm:text-sm md:text-base leading-tight" style={{ color: "darkgoldenrod" }}>
              {category.label}
            </span>
          </Link>

          {hasDropdown && hoveredCategory === category.name && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-[100] overflow-hidden"
              onMouseEnter={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
              style={{ animation: 'fadeIn 0.15s ease-out' }}
            >
              <div className="py-2">
                {CATEGORY_SUBCATEGORIES[category.name].map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(sub.link)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group"
                  >
                    <img src={sub.image || "/category/image.png"} alt={sub.label} className="w-8 h-8 object-contain rounded" />
                    <span className="flex-1 text-sm text-gray-700 group-hover:text-teal-600 font-medium">{sub.label}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100">
                <button onClick={() => navigate(category.link)} className="w-full py-2.5 text-center text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-gray-50 transition-colors">
                  View All {category.name} →
                </button>
              </div>
            </div>
          )}
        </div>
      );
    })
  ), [hoveredCategory, navigate]);

  return (
    <section className="relative py-12">
      <Container className="overflow-visible">
        <h2 className="text-xl sm:text-2xl md:text-[30px] font-semibold mb-4 text-[#1a1a1a]">Top Categorie</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 w-full">{categoryCards}</div>
      </Container>
    </section>
  );
});

TopCategories.displayName = "TopCategories";