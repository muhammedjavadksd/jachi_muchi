import { memo, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "@/shared/components/Container/Container";
import { api } from "@/shared/lib/axios";
import { getImageUrl } from "@/shared/utils/image";

export const TopCategories = memo(function TopCategories(): JSX.Element | null {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/categories")
      .then((res) => {
        setCategories(res.data?.data?.categories || []);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleMouseEnter = (categoryName: string) => {
    setHoveredCategory(categoryName);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const FALLBACK_IMAGE = "https://placehold.co/200x140?text=Category";

  const categoryCards = useMemo(() => (
    categories.map((category: any) => {
      const hasDropdown = category?.shapes?.length > 0;
      const categoryImage = getImageUrl(category?.image) || FALLBACK_IMAGE;

      return (
        <div key={category._id || category.name} className="relative group">
          <Link
            to={`/category/${category.slug}`}
            className="flex flex-col items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
            onMouseEnter={() => handleMouseEnter(category.name)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="relative flex items-center justify-center overflow-hidden w-full"
              style={{ backgroundColor: "#f6f6f6", borderRadius: "16px", aspectRatio: "1 / 0.7" }}
            >
              <img src={categoryImage} alt={category.name} className="w-4/5 h-4/5 object-contain" loading="lazy" />
            </div>
            <span className="text-center font-medium text-xs sm:text-sm md:text-base leading-tight" style={{ color: "darkgoldenrod" }}>
              {category.name}
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
                {category.shapes.map((shape: any) => (
                  <button
                    key={shape._id || shape.name}
                    onClick={() =>
                      navigate(`/search/${category.slug}?shape=${shape.name}`)
                    }
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50"
                  >
                    <span className="flex-1 text-sm text-gray-700 capitalize">
                      {shape.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100">
                <button onClick={() => navigate(`/category/${category.slug}`)} className="w-full py-2.5 text-center text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-gray-50 transition-colors">
                  View All {category.name} →
                </button>
              </div>
            </div>
          )}
        </div>
      );
    })
  ), [categories, hoveredCategory, navigate]);

  if (loading) {
    return (
      <section className="relative py-12">
        <Container>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-full bg-gray-200 rounded-2xl animate-pulse" style={{ aspectRatio: "1 / 0.7" }} />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="relative py-12">
      <Container className="overflow-visible">
        <h2 className="text-xl sm:text-2xl md:text-[30px] font-semibold mb-4 text-[#1a1a1a]">Top Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 w-full">{categoryCards}</div>
      </Container>
    </section>
  );
});

TopCategories.displayName = "TopCategories";

