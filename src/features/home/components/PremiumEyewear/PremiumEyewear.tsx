import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/shared/components/Container/Container";
import { useCollectionSections } from "@/features/home/hooks/useCollectionSections";
import { getImageUrl } from "@/shared/utils/image";
import type {
  CollectionSection,
  CollectionSectionCard,
  PremiumBrandTile,
} from "@/features/home/types";

const FALLBACK_IMAGE = "https://placehold.co/800x600?text=Eyewear";

interface BrandCardProps {
  tile: PremiumBrandTile;
  featured?: boolean;
}

const BrandCard = memo(function BrandCard({
  tile,
  featured = false,
}: BrandCardProps): JSX.Element {
  const handleError = useMemo(
    () => (event: React.SyntheticEvent<HTMLImageElement>) => {
      event.currentTarget.src = FALLBACK_IMAGE;
    },
    []
  );

  return (
    <Link
      to={tile.link}
      className={`group relative block overflow-hidden rounded-2xl bg-gray-100 ${
        featured
          ? "h-72 sm:h-96 md:h-auto md:min-h-[460px] md:row-span-2"
          : "h-40 sm:h-48 md:h-auto"
      }`}
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
          <h3 className="text-white font-bold uppercase tracking-wide text-base sm:text-lg leading-tight truncate">
            {tile.name}
          </h3>
          {tile.tagline && (
            <p className="text-white/70 text-xs sm:text-sm mt-1">
              {tile.tagline}
            </p>
          )}
        </div>
        <span
          aria-hidden
          className="shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
        >
          <ArrowRight className="w-4 h-4 text-gray-900" />
        </span>
      </div>
    </Link>
  );
});

function toTile(card: CollectionSectionCard): PremiumBrandTile {
  return {
    name: card.title,
    tagline: card.tagline || "",
    image: card.thumbnail || "",
    link: `/search?cardId=${card._id}`,
  };
}

interface SectionBlockProps {
  section: CollectionSection;
}

const SectionBlock = memo(function SectionBlock({
  section,
}: SectionBlockProps): JSX.Element | null {
  const tiles = useMemo(() => section.cards.map(toTile), [section.cards]);
  const [featured, ...rest] = tiles;

  if (!featured) {
    return null;
  }

  return (
    <section className="relative py-12">
      <Container>
        <h2 className="text-xl sm:text-2xl md:text-[30px] font-semibold mb-4 text-[#1a1a1a]">
          {section.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-5">
          <BrandCard tile={featured} featured />
          {rest.map((tile) => (
            <BrandCard key={tile.link} tile={tile} />
          ))}
        </div>
      </Container>
    </section>
  );
});

export const PremiumEyewear = memo(function PremiumEyewear(): JSX.Element | null {
  const { sections, isLoading } = useCollectionSections();

  if (isLoading) {
    return (
      <section className="relative py-12">
        <Container>
          <div className="h-7 w-56 bg-gray-200 rounded-md mb-4 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-5">
            <div className="h-72 md:min-h-[460px] md:row-span-2 bg-gray-200 rounded-2xl animate-pulse" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-40 sm:h-48 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) => (
        <SectionBlock key={section._id} section={section} />
      ))}
    </>
  );
});

PremiumEyewear.displayName = "PremiumEyewear";
