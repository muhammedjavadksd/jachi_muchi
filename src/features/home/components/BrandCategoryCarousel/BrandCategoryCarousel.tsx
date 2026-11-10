import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/shared/components/Container/Container";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/components";
import { getImageUrl } from "@/shared/utils/image";
import { getAllBrands } from "@/features/product/api/brandApi";
import { getAllCategories } from "@/features/home/api/categoryApi";
import type { BrandItem } from "@/features/product/types";
import type { CategoryApiItem } from "@/features/home/api/categoryApi";

type TabType = "brand" | "category";

interface CarouselItem {
  id: string;
  name: string;
  image?: string;
  typeLabel: "Frame" | "Lens";
  link: string;
}



function getTypeLabel(itemType?: string): "Frame" | "Lens" {
  if (!itemType) return "Frame";
  const t = itemType.toLowerCase();
  if (t === "lens") return "Lens";
  return "Frame";
}

function getFirstLetter(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

const ItemCard = memo(function ItemCard({
  item,
  isBrandTab,
  showTypeLabel,
}: {
  item: CarouselItem;
  isBrandTab: boolean;
  showTypeLabel: boolean;
}): JSX.Element {
  const imageUrl = getImageUrl(item.image);
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(imageUrl) && !imageError;

  const imageClassName = isBrandTab
    ? "h-full w-full object-contain object-center mix-blend-multiply"
    : "h-full w-full object-cover object-center";

  return (
    <Link
      to={item.link}
      className="group flex w-[168px] shrink-0 snap-start flex-col focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-[#b8860b] focus-visible:ring-offset-[3px] sm:w-[200px] md:w-[228px] lg:w-[256px]"
      aria-label={item.name}
    >
      <div className="relative isolate aspect-square w-full overflow-hidden rounded-none bg-[#f3f2f0]">
        {showImage ? (
          <div className="absolute inset-0 flex items-center justify-center p-[16%]">
            <img
              src={imageUrl}
              alt={item.name}
              className={`${imageClassName} transition-transform duration-300 group-hover:scale-105`}
              loading="lazy"
              draggable={false}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#f3f2f0]">
            <span className="text-2xl font-medium text-gray-600 sm:text-3xl">
              {getFirstLetter(item.name)}
            </span>
          </div>
        )}
      </div>
      <div className="mt-3.5 flex w-full flex-col gap-1">
        <span className="line-clamp-2 min-h-[42px] w-full text-left text-[15px] font-normal uppercase leading-snug tracking-[0.05em] text-[#1a1a1a] transition-colors duration-200 group-hover:text-[#b8860b]">
          {item.name}
        </span>
        {showTypeLabel && (
          <span className="text-left text-[11px] leading-none text-gray-500 sm:text-xs">
            {item.typeLabel}
          </span>
        )}
      </div>
    </Link>
  );
});

ItemCard.displayName = "ItemCard";

export const BrandCategoryCarousel = memo(function BrandCategoryCarousel(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>("brand");
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [categories, setCategories] = useState<CategoryApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([getAllBrands("lens"), getAllCategories("lens")])
      .then(([brandsData, categoriesData]) => {
        if (cancelled) return;
        setBrands(brandsData || []);
        setCategories(categoriesData || []);
      })
      .catch((err) => {
        console.error("Failed to fetch brands/categories:", err);
        if (cancelled) return;
        setBrands([]);
        setCategories([]);
        setError("Nothing to show yet.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const brandItems: CarouselItem[] = useMemo(() => {
    const sorted = [...brands].sort((a, b) => {
      const aOrder = (a as any).displayOrder ?? (a as any).order ?? 0;
      const bOrder = (b as any).displayOrder ?? (b as any).order ?? 0;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name);
    });

    return sorted
      .filter((b) => b.isActive !== false)
      .map((brand) => ({
        id: brand._id,
        name: brand.name,
        image: brand.logo,
        typeLabel: getTypeLabel(brand.type),
        link: `/search?brand=${brand._id}`,
      }));
  }, [brands]);

  const categoryItems: CarouselItem[] = useMemo(() => {
    const sorted = [...categories].sort((a, b) => {
      const aOrder = a.displayOrder ?? a.order ?? 0;
      const bOrder = b.displayOrder ?? b.order ?? 0;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name);
    });

    return sorted
      .filter((c) => c.isActive !== false)
      .map((category) => ({
        id: category._id,
        name: category.name,
        image: category.image,
        typeLabel: getTypeLabel(category.type),
        link: category.slug ? `/category/${category.slug}` : `/search`,
      }));
  }, [categories]);

  const items = activeTab === "brand" ? brandItems : categoryItems;

  const showTypeLabel = useMemo(() => {
    if (items.length === 0) return false;
    const types = new Set(items.map((item) => item.typeLabel));
    return types.size > 1;
  }, [items]);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // New item sets start at the container edge (also guards restored scroll
    // positions on back/forward navigation), so the first card is never clipped.
    el.scrollLeft = 0;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    // Recheck after layout/paint
    const timeout = window.setTimeout(updateScrollButtons, 50);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      window.clearTimeout(timeout);
    };
  }, [items, updateScrollButtons]);

  useEffect(() => {
    const el = scrollRef.current;
    // Tab changes swap the item set; return the strip to its start so the first
    // card stays flush with the content container instead of appearing clipped.
    if (el) el.scrollLeft = 0;
    updateScrollButtons();
    const timeout = window.setTimeout(updateScrollButtons, 50);
    return () => window.clearTimeout(timeout);
  }, [activeTab, updateScrollButtons]);

  const scrollByAmount = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, tab: TabType) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActiveTab(tab);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const nextTab = tab === "brand" ? "category" : "brand";
        setActiveTab(nextTab);
        const buttons = document.querySelectorAll<HTMLButtonElement>('[role="tab"][data-tablist="brand-category"]');
        buttons.forEach((btn) => {
          if (btn.dataset.tab === nextTab) {
            btn.focus();
          }
        });
      }
    },
    []
  );

  if (loading) {
    return (
      <section className="relative pb-8 pt-8 sm:pb-10 sm:pt-10">
        <Container>
          <div className="mb-1 h-3 w-28 animate-pulse rounded bg-gray-200" />
          <div className="mb-6 h-8 w-72 animate-pulse rounded bg-gray-200 sm:h-9 md:h-10" />
          <div className="relative mb-[75px]">
            <div className="flex gap-6 border-b border-[#1a1a1a]">
              <div className="h-10 w-16 animate-pulse rounded bg-gray-100" />
              <div className="h-10 w-20 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
          <div className="flex gap-4 overflow-hidden sm:gap-5 lg:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex w-[168px] shrink-0 flex-col sm:w-[200px] md:w-[228px] lg:w-[256px]">
                <div className="aspect-square w-full animate-pulse rounded-none bg-gray-200" />
                <div className="mt-3.5 h-4 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (error && items.length === 0) {
    return (
      <section className="relative pb-8 pt-8 sm:pb-10 sm:pt-10">
        <Container>
          <p className="mb-1 text-[13px] uppercase tracking-[0.04em] text-gray-500">Explore our range</p>
          <h2 className="mb-6 text-xl font-semibold text-[#1a1a1a] font-brand sm:text-2xl md:text-[30px]">
            Shop by brand &amp; category
          </h2>
          <p className="text-sm text-gray-500">Nothing to show yet.</p>
        </Container>
      </section>
    );
  }

  const showArrows = canScrollLeft || canScrollRight;

  return (
    <section className="relative pb-8 pt-8 sm:pb-8 sm:pt-10">
      <Container>
        <p className="mb-1 text-[13px] uppercase tracking-[0.04em] text-gray-500">Explore our range</p>
        <h2 className="mb-6 text-xl font-semibold text-[#1a1a1a] font-brand sm:text-2xl md:text-[30px]">
          Shop by brand &amp; category
        </h2>

        <div className="relative mb-[75px]">
          <div
            role="tablist"
            aria-label="Shop by brand and category"
            className="flex border-b border-[#1a1a1a]"
            data-tablist="brand-category"
          >
            <button
              role="tab"
              aria-selected={activeTab === "brand"}
              data-tab="brand"
              onClick={() => setActiveTab("brand")}
              onKeyDown={(e) => handleTabKeyDown(e, "brand")}
              className={`relative outline-none focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-[#b8860b] focus-visible:ring-offset-[3px] ${
                activeTab === "brand" ? "font-semibold text-[#1a1a1a]" : "font-semibold text-gray-500"
              }`}
              style={{ fontSize: "clamp(15px, 1.4vw, 18px)", padding: "10px 14px 14px" }}
            >
              Brand
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "category"}
              data-tab="category"
              onClick={() => setActiveTab("category")}
              onKeyDown={(e) => handleTabKeyDown(e, "category")}
              className={`relative outline-none focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-[#b8860b] focus-visible:ring-offset-[3px] ${
                activeTab === "category" ? "font-semibold text-[#1a1a1a]" : "font-semibold text-gray-500"
              }`}
              style={{ fontSize: "clamp(15px, 1.4vw, 18px)", padding: "10px 14px 14px" }}
            >
              Category
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-gray-500">Nothing to show yet.</p>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain sm:gap-5 lg:gap-6"
              style={{
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                scrollPaddingInline: 0,
                WebkitOverflowScrolling: "touch",
              }}
            >
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isBrandTab={activeTab === "brand"}
                  showTypeLabel={showTypeLabel}
                />
              ))}
            </div>

            {showArrows && (
              <div className="relative z-10 mt-6 flex items-center justify-end gap-0 pr-20">
                <button
                  type="button"
                  onClick={() => scrollByAmount("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroll left"
                  className={`flex h-10 w-10 items-center justify-center border-r border-gray-300 text-gray-700 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-[#b8860b] focus-visible:ring-offset-[3px] ${
                    canScrollLeft ? "hover:bg-gray-50" : "cursor-not-allowed text-gray-300"
                  }`}
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByAmount("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroll right"
                  className={`flex h-10 w-10 items-center justify-center text-gray-700 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-[#b8860b] focus-visible:ring-offset-[3px] ${
                    canScrollRight ? "hover:bg-gray-50" : "cursor-not-allowed text-gray-300"
                  }`}
                >
                  <ChevronRightIcon />
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
});

BrandCategoryCarousel.displayName = "BrandCategoryCarousel";
