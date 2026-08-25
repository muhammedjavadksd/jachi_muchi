import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/shared/components/Container/Container";
import { getImageUrl } from "@/shared/utils/image";
import type {
  BrandBentoTile,
  BrandBentoSectionProps,
} from "@/features/home/types";

const FALLBACK_IMAGE = "https://placehold.co/800x600?text=Eyewear";

interface BrandTileProps {
  tile: BrandBentoTile;
  className?: string;
}

const BrandTile = memo(function BrandTile({
  tile,
  className = "",
}: BrandTileProps): JSX.Element {
  const handleError = useMemo(
    () => (event: React.SyntheticEvent<HTMLImageElement>) => {
      event.currentTarget.src = FALLBACK_IMAGE;
    },
    []
  );

  return (
    <Link
      to={tile.link}
      className={`group relative block overflow-hidden rounded-2xl bg-gray-100 ${className}`}
    >
      <img
        src={getImageUrl(tile.image) || FALLBACK_IMAGE}
        alt={tile.name}
        loading="lazy"
        onError={handleError}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <h3 className="text-white font-bold uppercase tracking-wide text-lg sm:text-xl md:text-2xl leading-tight">
            {tile.name}
          </h3>
          {tile.tagline && (
            <p className="text-white/80 text-xs sm:text-sm mt-1">
              {tile.tagline}
            </p>
          )}
        </div>

        <span
          aria-hidden
          className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-colors duration-300 group-hover:bg-gray-900"
        >
          <ArrowRight className="w-4 h-4 text-gray-900 transition-colors duration-300 group-hover:text-white" />
        </span>
      </div>
    </Link>
  );
});

BrandTile.displayName = "BrandTile";

export const BrandBentoGrid = memo(function BrandBentoGrid({
  featured,
  brands,
}: BrandBentoSectionProps): JSX.Element | null {
  if (!featured || brands.length === 0) return null;

  return (
    <section className="relative py-10 sm:py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-5">
          <BrandTile
            tile={featured}
            className="h-64 sm:h-72 md:h-auto md:row-span-2"
          />

          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {brands.map((brand) => (
              <BrandTile
                key={brand.link}
                tile={brand}
                className="h-40 sm:h-48 md:h-auto"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
});

BrandBentoGrid.displayName = "BrandBentoGrid";
