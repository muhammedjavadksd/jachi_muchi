import { memo } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/shared/components/Container/Container";
import { getImageUrl } from "@/shared/utils/image";
import type { BrandItem } from "@/features/product/types";

const FALLBACK = "https://placehold.co/400x300/f6f6f6/999999?text=Brand";

interface BrandsSectionProps {
  brands: BrandItem[];
}

export const BrandsSection = memo(function BrandsSection({
  brands,
}: BrandsSectionProps): JSX.Element | null {
  const active = brands.filter((b) => b.isActive);
  if (active.length === 0) return null;

  return (
    <section className="w-full bg-white py-12">
      <Container>
        <h2 className="font-semibold mb-6 text-[30px] text-[#1a1a1a]">Our Brands</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {active.map((brand) => {
            const logo = getImageUrl(brand.logo) || FALLBACK;
            return (
              <Link
                key={brand._id}
                to={`/search?brand=${brand._id}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 hover:shadow-md hover:border-gray-200 transition-all duration-200"
              >
                <div className="w-full overflow-hidden rounded-xl bg-gray-50" style={{ aspectRatio: "4 / 3" }}>
                  <img
                    src={logo}
                    alt={brand.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK;
                    }}
                  />
                </div>
                <span className="text-center text-sm sm:text-base md:text-lg font-medium text-gray-700 leading-tight line-clamp-2">
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
});

BrandsSection.displayName = "BrandsSection";
