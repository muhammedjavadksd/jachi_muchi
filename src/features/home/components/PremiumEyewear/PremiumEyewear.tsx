import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/shared/components/Container/Container";
import { resolveCardImagePosition } from "@/features/home/constants";
import { useCollectionSections } from "@/features/home/hooks/useCollectionSections";
import { getImageUrl } from "@/shared/utils/image";
import type {
  CollectionSection,
  CollectionSectionCard,
  PremiumBrandTile,
  PremiumEyewearProps,
} from "@/features/home/types";

const FALLBACK_IMAGE = "https://placehold.co/800x600?text=Eyewear";

interface BrandCardProps {
  tile: PremiumBrandTile;
  featured?: boolean;
  /** "hero" = large left tile layout (≤5 cards), "grid" = uniform equal-size tiles (6+ cards) */
  variant?: "hero" | "grid";
  /** Mobile only: spans both columns (used for an odd leftover last card) */
  fullWidthOnMobile?: boolean;
}

const BrandCard = memo(function BrandCard({
  tile,
  featured = false,
  variant = "hero",
  fullWidthOnMobile = false,
}: BrandCardProps): JSX.Element {
  const handleError = useMemo(
    () => (event: React.SyntheticEvent<HTMLImageElement>) => {
      event.currentTarget.src = FALLBACK_IMAGE;
    },
    []
  );

  const mobileShape = featured
    ? "col-span-2 aspect-[4/3] rounded-3xl"
    : fullWidthOnMobile
      ? "col-span-2 aspect-[2/1] rounded-2xl"
      : "aspect-[3/2] rounded-2xl";

  const cardClassName =
    variant === "grid"
      ? `group relative block overflow-hidden bg-gray-100 ${mobileShape} md:col-span-1 md:rounded-2xl md:aspect-[4/3] lg:aspect-[5/4]`
      : `group relative block overflow-hidden bg-gray-100 ${mobileShape} md:col-span-1 md:rounded-2xl ${
          featured
            ? "md:aspect-auto md:min-h-[460px] md:row-span-2"
            : "md:aspect-auto"
        }`;

  const arrowSize = featured ? "w-8 h-8" : "w-7 h-7";
  const titleSize = featured ? "text-base" : "text-sm";
  const mobilePosition = featured ? "object-[50%_70%]" : "object-center";

  const objectPosition = resolveCardImagePosition(
    tile.image,
    tile.imagePosition
  );

  return (
    <Link to={tile.link} className={cardClassName}>
      <img
        src={getImageUrl(tile.image) || FALLBACK_IMAGE}
        alt={tile.name}
        loading="lazy"
        onError={handleError}
        style={{ "--card-pos": objectPosition } as React.CSSProperties}
        className={`absolute inset-0 w-full h-full object-cover ${mobilePosition} md:object-[var(--card-pos)] transition-transform duration-500 ease-out group-hover:scale-105`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-2.5 md:p-5">
        <div className="min-w-0">
          <h3
            className={`text-white font-bold uppercase tracking-wide ${titleSize} md:text-lg leading-tight truncate`}
          >
            {tile.name}
          </h3>
          {tile.tagline && (
            <p className="text-white/70 text-xs md:text-sm mt-0.5 md:mt-1">
              {tile.tagline}
            </p>
          )}
        </div>
        <span
          aria-hidden
          className={`shrink-0 ${arrowSize} md:w-9 md:h-9 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1`}
        >
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-900" />
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
    imagePosition: card.imagePosition,
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
  const hasOddLeftover = rest.length % 2 === 1;

  if (!featured) {
    return null;
  }

  return (
    <section className="relative pt-5 pb-4 md:py-12">
      <Container>
        <h2 className="text-xl sm:text-2xl md:text-[30px] font-semibold mb-3 md:mb-4 text-[#1a1a1a] font-brand">
          {section.name}
        </h2>
        {tiles.length >= 6 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {tiles.map((tile, index) => (
              <BrandCard
                key={tile.link}
                tile={tile}
                variant="grid"
                featured={index === 0}
                fullWidthOnMobile={hasOddLeftover && index === tiles.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-3 md:gap-5">
            <BrandCard tile={featured} featured />
            {rest.map((tile, index) => (
              <BrandCard
                key={tile.link}
                tile={tile}
                fullWidthOnMobile={hasOddLeftover && index === rest.length - 1}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
});

export const PremiumEyewear = memo(function PremiumEyewear({
  minHomepageOrder,
  maxHomepageOrder,
}: PremiumEyewearProps): JSX.Element | null {
  const { sections, isLoading } = useCollectionSections();

  const visibleSections = useMemo(
    () =>
      sections.filter(
        (section) =>
          (minHomepageOrder === undefined ||
            section.homepageOrder >= minHomepageOrder) &&
          (maxHomepageOrder === undefined ||
            section.homepageOrder < maxHomepageOrder)
      ),
    [sections, minHomepageOrder, maxHomepageOrder]
  );

  if (isLoading) {
    return (
      <section className="relative pt-5 pb-4 md:py-12">
        <Container>
          <div className="h-7 w-56 bg-gray-200 rounded-md mb-3 md:mb-4 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-3 md:gap-5">
            <div className="col-span-2 aspect-[4/3] rounded-3xl md:col-span-1 md:aspect-auto md:h-72 md:rounded-2xl md:min-h-[460px] md:row-span-2 bg-gray-200 animate-pulse" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[3/2] rounded-2xl md:aspect-auto md:h-48 bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <>
      {visibleSections.map((section) => (
        <SectionBlock key={section._id} section={section} />
      ))}
    </>
  );
});

PremiumEyewear.displayName = "PremiumEyewear";
