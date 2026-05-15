import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { Footer, WhatsAppButton, PromotionHeader, Campaign } from "../../components";
import { Container } from "../../components/Container/Container";
import { Grid } from "../../components/Grid/Grid";
import { FilterSidebar } from "../../components/FilterSidebar/FilterSidebar";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { useParams, useSearchParams } from "react-router-dom";

import { SEARCH_FILTERS } from "../../lib/constants";
import { X, SlidersHorizontal } from "lucide-react";
import { getProducts } from "../../api/product";
import { getBrands } from "../../api/brand";
import { getBanners } from "../../api/banner";
import { getOffers, getBestOfferBadge } from "../../lib/offerEngine";
import { getImageUrl } from "../../lib/image";
import type { Offer } from "../../types/offers.types";

const PROMOTION_HEADER_HEIGHT = 140;

export const SearchPage = memo(function SearchPage(): JSX.Element {
  const [sortBy, setSortBy] = useState("best-sellers");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [offers, setOffers] = useState<Offer[]>([]);

  const [categoryBanner, setCategoryBanner] = useState<any>(null);

  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const shape = searchParams.get("shape");

  const collectionSlug = searchParams.get("collection");
  const brandFromQuery = searchParams.get("brand");



  // Fetch brands and inject into filter config
  const [filterConfig, setFilterConfig] = useState(SEARCH_FILTERS);

  useEffect(() => {
    getBrands().then((brands) => {
      setFilterConfig((prev) =>
        prev.map((g) =>
          g.id === "brands"
            ? {
                ...g,
                options: brands.map((b) => ({
                  id: b._id,
                  label: b.name,
                })),
              }
            : g
        )
      );
    }).catch(() => {});
    getOffers().then(setOffers).catch(() => {});
  }, []);

  useEffect(() => {
    if (category) {
      getBanners().then((allBanners) => {
        const found = allBanners.find((b: any) => 
          b.isActive && 
          b.type === "category" && 
          (b.title?.toLowerCase() === category?.toLowerCase() || b.redirectUrl?.includes(category))
        );
        setCategoryBanner(found);
      }).catch(() => setCategoryBanner(null));
    } else {
      setCategoryBanner(null);
    }
  }, [category]);

  // API CALL with filters
  useEffect(() => {
    setLoading(true);

    const params: Record<string, any> = {
      category,
    };

    if (collectionSlug) params.collection = collectionSlug;

    if (brandFromQuery) params.brand = brandFromQuery;

    if (shape) params.shape = shape;
    if (filters["frame-shape"]?.length) params.shape = filters["frame-shape"].join(",");
    if (filters["frame-type"]?.length) params.frameType = filters["frame-type"].join(",");
    if (filters["frame-color"]?.length) params.color = filters["frame-color"].join(",");
    if (filters["brands"]?.length) params.brand = filters["brands"].join(",");

    getProducts(params)
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .finally(() => setLoading(false));
  }, [category, shape, filters, collectionSlug, brandFromQuery]);

  const spacerStyle = useMemo(
    () => ({
      height: `${PROMOTION_HEADER_HEIGHT}px`,
    }),
    []
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value);
    },
    []
  );

  const handleFilterChange = useCallback(
    (newFilters: Record<string, string[]>) => {
      setFilters(newFilters);
    },
    []
  );

  const productCards = useMemo(() =>
    products.map((product: any, index) => {
      const colors = (product.variants || []).map((v: any) => ({
        colorCode: {
          black: "#000000", blue: "#1e40af", pink: "#ec4899", red: "#dc2626",
          green: "#16a34a", gold: "#d4a017", silver: "#c0c0c0", grey: "#6b7280",
          brown: "#8b4513", transparent: "#f0f0f0", purple: "#7c3aed",
          "rose-gold": "#b76e79", gunmetal: "#2c3539", white: "#ffffff",
        }[v.color?.toLowerCase()] || v.image || "#888888",
        image: getImageUrl(v.image || product.images?.[0]),
        name: v.color,
      }));

        const images =
          product.images && product.images.length > 0
            ? product.images.map((img: string) => getImageUrl(img))
            : ["/placeholder.png"];

        const offerBadge = getBestOfferBadge(product._id, product.price, offers);

        return (
          <ProductCard
            key={product._id || index}
            images={images}
            name={product.name}
            description={product.description || ""}
            price={product.price}
            originalPrice={product.mrp > product.price ? product.mrp : undefined}
            discount={product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : undefined}
            rating={product.rating || undefined}
            reviews={product.reviewCount || undefined}
            colors={colors.length > 0 ? colors : undefined}
            link={`/product/${product._id}`}
            offerLabel={offerBadge?.label}
            offerBadgeColor={offerBadge?.color}
          />
        );
      }),
    [products, offers]
  );

  // ✅ LOADING STATE
  if (loading) {
    return <div className="p-10 text-center">Loading products...</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1">
        <Container>

          {categoryBanner && (
            <div className="pt-6">
              <Campaign 
                image={categoryBanner.image} 
                link={categoryBanner.redirectUrl || "#"} 
                alt={categoryBanner.title} 
              />
            </div>
          )}

          
          <div className="flex flex-col lg:flex-row gap-6 pt-6 pb-12">

            {/* FILTER SIDEBAR */}
            <div
              className={`
              lg:w-72 lg:shrink-0 lg:self-start lg:sticky lg:overflow-y-auto
              ${
                showFilters
                  ? "fixed inset-0 z-50 bg-white lg:relative"
                  : "hidden lg:block"
              }
            `}
            >
              <div className="lg:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="lg:pr-4 lg:pb-6 p-4 lg:p-0">
                <FilterSidebar
                  filters={filterConfig}
                  onFilterChange={handleFilterChange}
                />
              </div>

              <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* PRODUCT AREA */}
            <div className="flex-1 min-w-0">
              <div className="bg-gray-900 text-white rounded-t-2xl overflow-hidden">
                <div className="px-4 py-4 lg:px-6 lg:py-5 flex justify-between items-center">

                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl text-sm"
                  >
                    <SlidersHorizontal size={18} />
                    Filters
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">SORT:</span>
                    <select
                      value={sortBy}
                      onChange={handleSortChange}
                      className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm"
                    >
                      <option value="best-sellers">Best Sellers</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PRODUCT GRID */}
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl p-4 lg:p-6">
                <Grid columns={4} gap={5}>
                  {products.length === 0 ? (
                    <p className="text-center col-span-full py-10">
                      No products found
                    </p>
                  ) : (
                    productCards
                  )}
                </Grid>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

SearchPage.displayName = "SearchPage";