import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/SectionHeading";
import { getProducts } from "@/features/product/api/productApi";
import { getImageUrl } from "@/shared/utils/image";
import { formatCurrency } from "@/shared/utils/format";

/**
 * "Trending Products" homepage section.
 *
 * Copy below is data-driven: swap the values to change it without touching the JSX.
 */
const trendingImage = "/banner/trending.jpeg";
const mainLink = "/search";
const exploreLink = "/search?trending=true";

const trendingText =
  "Our most-loved frames this season. Lightweight, easy to wear, and picked by thousands of customers like you.";

const SKELETON_COUNT = 4;

/** Maps an API product to the card view-model used by this section. */
const toCardProps = (product) => {
  const id = product?._id || product?.id || product?.slug;
  return {
    id,
    name: product?.name,
    price: formatCurrency(product?.price ?? 0),
    image: getImageUrl(product?.images?.[0] || product?.image),
    brand: product?.brand?.name || product?.brand || "",
    link: `/product/${id}`,
  };
};

/** Shared focus-visible treatment so every interactive element is keyboard-visible. */
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfcfa]";

const GAP = 16;
const AUTOSCROLL_INTERVAL = 3000;
const TOUCH_RESUME_DELAY = 3000;

export function TrendingProducts() {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs (not state) so pausing/auto-scrolling never triggers a re-render.
  const isPausedRef = useRef(false);
  const intervalRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getProducts({ sortBy: "best-sellers", limit: 8 })
      .then((res) => {
        if (cancelled) return;
        const data =
          res?.data?.data?.products || res?.data?.products || res?.products || [];
        setProducts((data || []).map(toCardProps));
      })
      .catch((error) => {
        console.error("Failed to fetch trending products:", error);
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * (Re)starts the auto-scroll interval. Safe to call repeatedly: it clears any
   * in-flight interval first, so manual interaction resets the 3s timer.
   */
  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      // Nothing to scroll (too few products to overflow the row).
      if (el.scrollWidth - el.clientWidth <= 5) return;

      const firstCard = el.querySelector("[data-card]");
      if (!firstCard) return;
      const cardStep = firstCard.offsetWidth + GAP;

      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardStep, behavior: "smooth" });
      }
    }, AUTOSCROLL_INTERVAL);
  }, []);

  useEffect(() => {
    // Start only once data has loaded; re-created whenever the product count changes.
    if (loading || products.length === 0) return;
    // Respect the user's motion preference: never auto-scroll if reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleVisibility = () => {
      isPausedRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const el = scrollRef.current;
    const isScrollable = el ? el.scrollWidth - el.clientWidth > 5 : false;
    if (isScrollable) startAutoScroll();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [loading, products.length, startAutoScroll]);

  const handleMouseEnter = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  const handleTouchStart = useCallback(() => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, TOUCH_RESUME_DELAY);
  }, []);

  // Error (empty result) or no trending products: hide the section silently.
  if (!loading && products.length === 0) return null;

  return (
    <section className="bg-[#fdfcfa] px-[4vw] py-14">
      <SectionHeading title="Trending Products" />

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
        <Link to={mainLink} aria-label="Explore trending products" className={`block ${focusRing}`}>
          <img
            src={trendingImage}
            alt="Man wearing round eyeglasses, trending frames"
            loading="lazy"
            className="w-full h-full aspect-[3/2] object-cover object-top"
          />
        </Link>

        <div className="flex flex-col gap-7 min-w-0">
          <Link
            to={exploreLink}
            className={`self-start font-semibold border-b border-black pb-1 hover:opacity-70 transition-opacity ${focusRing}`}
          >
            Explore all →
          </Link>

          <div
            ref={scrollRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loading
              ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <div
                    key={`trending-skeleton-${i}`}
                    aria-hidden="true"
                    className="shrink-0 w-[45%] sm:w-[40%] lg:w-[32%] animate-pulse"
                  >
                    <div className="w-full aspect-[10/11] bg-gray-200" />
                    <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="mt-1 h-3 w-1/3 bg-gray-200 rounded" />
                  </div>
                ))
              : products.map((product) => (
                  <Link
                    key={product.id}
                    to={product.link}
                    data-card
                    className={`group shrink-0 snap-start w-[45%] sm:w-[40%] lg:w-[32%] ${focusRing}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full aspect-[10/11] object-contain bg-[#f7f7f7] p-2"
                    />
                    <h3 className="mt-2 font-medium group-hover:underline">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{product.price}</p>
                  </Link>
                ))}
          </div>
          <p className="mt-6 text-base text-gray-600 max-w-md leading-relaxed">{trendingText}</p>
        </div>
      </div>
    </section>
  );
}

export default TrendingProducts;
