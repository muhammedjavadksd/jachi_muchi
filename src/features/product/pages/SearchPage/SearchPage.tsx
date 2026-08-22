import { memo, useMemo } from "react";
import { Footer, WhatsAppButton, PromotionHeader } from "@/components";
import { Campaign } from "@/features/home/components/Campaign/Campaign";
import { Container } from "@/shared/components/Container/Container";
import { Grid } from "@/shared/components/Grid/Grid";
import { FilterSidebar } from "@/features/product/components/FilterSidebar/FilterSidebar";
import { ProductCard } from "@/features/product/components/ProductCard/ProductCard";
import { X, SlidersHorizontal } from "lucide-react";
import { mapProductToCardProps } from "@/features/product/utils/mapProductToCardProps";
import { useProductSearch } from "@/features/product/hooks";
import type { OfferBadge } from "@/features/offer/types";

const PROMOTION_HEADER_HEIGHT = 140;

const ProductGrid = memo(function ProductGrid({
  products,
  loading,
  fetching,
  sortBy,
  onSortChange,
  onToggleFilters,
  getOfferBadge,
}: {
  products: any[];
  loading: boolean;
  fetching: boolean;
  sortBy: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onToggleFilters: (v: boolean) => void;
  getOfferBadge: (productId: string, price: number) => OfferBadge | null;
}): JSX.Element {
  console.log("ProductGrid rendered");

  const productCards = useMemo(() =>
    products.map((product: any, index) => (
      <div key={product._id || index} className="h-full transition-opacity duration-300 ease-in-out">
        <ProductCard {...mapProductToCardProps(product, getOfferBadge)} />
      </div>
    )),
  [products, getOfferBadge]);

  if (loading) {
    return (
      <div className="flex-1 min-w-0 min-h-[400px] lg:min-h-0 flex flex-col">
        <div className="shrink-0 bg-gray-900 text-white rounded-t-2xl overflow-hidden">
          <div className="px-4 py-4 lg:px-6 lg:py-5 flex justify-between items-center">
            <div className="lg:hidden w-24 h-9 bg-gray-800 rounded-xl" />
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">SORT:</span>
              <div className="w-40 h-9 bg-gray-800 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl p-4 lg:p-6 min-h-[400px] lg:min-h-0 flex-1 lg:overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-gray-200 overflow-hidden bg-white">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-5 bg-gray-200 rounded-md" />
                    <div className="w-12 h-3 bg-gray-200 rounded" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 min-h-[400px] lg:min-h-0 flex flex-col">
      {fetching && (
        <div className="shrink-0 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
      )}
      <div className="shrink-0 bg-gray-900 text-white rounded-t-2xl overflow-hidden">
        <div className="px-4 py-4 lg:px-6 lg:py-5 flex justify-between items-center">
          <button onClick={() => onToggleFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl text-sm">
            <SlidersHorizontal size={18} />
            Filters
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">SORT:</span>
            <select value={sortBy} onChange={onSortChange} className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm">
              <option value="best-sellers">Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl p-4 lg:p-6 flex-1 lg:min-h-0 lg:overflow-y-auto scrollbar-hide">
        {products.length === 0 && !fetching ? (
          <p className="text-center col-span-full py-10">No products found</p>
        ) : (
          <Grid columns={4} gap={5}>
            {productCards}
          </Grid>
        )}
      </div>
    </div>
  );
});

ProductGrid.displayName = "ProductGrid";

export const SearchPage = memo(function SearchPage(): JSX.Element {
  const {
    products,
    loading,
    fetching,
    sortBy,
    showFilters,
    pendingFilters,
    filterConfig,
    categoryBanner,
    pendingCount,
    applyCount,
    handleSortChange,
    handleFilterChange,
    applyFilters,
    clearFilters,
    setShowFilters,
    getOfferBadge,
  } = useProductSearch();

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1">
        <Container>
          {categoryBanner && (
            <div className="pt-6">
              <Campaign image={categoryBanner.image} link={categoryBanner.redirectUrl || "#"} alt={categoryBanner.title} />
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 pt-6 pb-12 lg:h-[calc(100vh-140px)] lg:min-h-0">
            {loading && (
              <div className="hidden lg:block lg:w-72 lg:shrink-0 animate-pulse">
                <div className="lg:pr-4 lg:pb-6">
                  {[160, 120, 140, 100, 130].map((h, i) => (
                    <div key={i} className="border-b border-gray-100 py-4">
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                      <div className="space-y-3" style={{ height: h }}>
                        {Array.from({ length: Math.ceil(h / 28) }).map((_, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded border-2 border-gray-200 bg-white" />
                            <div className="h-3 bg-gray-100 rounded flex-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && (
              <div className={`${showFilters ? "fixed inset-0 z-50 bg-white flex flex-col" : "hidden lg:block"} lg:relative lg:flex lg:flex-col lg:w-72 lg:shrink-0 lg:h-full lg:min-h-0 lg:inset-auto lg:z-auto lg:overflow-hidden`}>
                <div className="lg:hidden flex items-center justify-between p-4 border-b shrink-0">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="p-2">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 min-h-0 p-4 lg:p-0 lg:pr-4">
                  <FilterSidebar
                    filters={filterConfig}
                    pendingFilters={pendingFilters}
                    appliedCount={applyCount}
                    onFilterChange={handleFilterChange}
                    onApply={applyFilters}
                    onClear={clearFilters}
                  />
                </div>
              </div>
            )}

            <ProductGrid
              products={products}
              loading={loading}
              fetching={fetching}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onToggleFilters={setShowFilters}
              getOfferBadge={getOfferBadge}
            />
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

SearchPage.displayName = "SearchPage";

