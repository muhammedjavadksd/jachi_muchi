import { memo, useMemo, useState, useCallback } from "react";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";
import { Grid } from "../../components/Grid/Grid";
import { FilterSidebar } from "../../components/FilterSidebar/FilterSidebar";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { 
  SEARCH_FILTERS, 
  SAMPLE_PRODUCTS,
} from "../../lib/constants";

/** Height of the promotion header (utility bar + main nav + category bar) */
const PROMOTION_HEADER_HEIGHT = 140;

/**
 * Search/Product listing page
 * Displays filters sidebar and product grid
 * Uses PromotionHeader with light theme and category navigation
 */
export const SearchPage = memo(function SearchPage(): JSX.Element {
  const [sortBy, setSortBy] = useState("best-sellers");
  const [activeTab, setActiveTab] = useState("eyeglasses");
  const [viewMode, setViewMode] = useState<"frames" | "virtual">("frames");

  /** Memoize header spacer style */
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  /** Handle sort change */
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  }, []);

  /** Handle filter change */
  const handleFilterChange = useCallback((filters: Record<string, string[]>) => {
    console.log("Filters changed:", filters);
    // Filter logic here
  }, []);

  /** Memoize product cards */
  const productCards = useMemo(() => (
    SAMPLE_PRODUCTS.map((product, index) => (
      <ProductCard
        key={index}
        images={product.images}
        name={product.name}
        description={product.description}
        price={product.price}
        originalPrice={product.originalPrice}
        discount={product.discount}
        rating={product.rating}
        reviews={product.reviews}
        colors={product.colors}
        link={product.link}
      />
    ))
  ), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Promotion Header - Light theme with categories */}
      <PromotionHeader />
      
      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1">
        <Container>
          <div className="flex gap-8 pt-6">
            {/* Filter Sidebar - Sticky with independent scroll */}
            <div 
              className="w-64 shrink-0 self-start sticky overflow-y-auto pr-4 pb-6 scrollbar-thin"
              style={{ top: `${PROMOTION_HEADER_HEIGHT}px`, maxHeight: `calc(100vh - ${PROMOTION_HEADER_HEIGHT}px)` }}
            >
              <FilterSidebar 
                filters={SEARCH_FILTERS}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Product Listing Box - scrolls with page, only top and left border */}
            <div className="flex-1 border-t border-l border-gray-200 rounded-tl-lg overflow-hidden">
              {/* Header with dark background */}
              <div className="bg-gray-800 px-5 py-4">
                <div className="flex items-center justify-between">
                  {/* Left: Tabs */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab("eyeglasses")}
                      className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
                        activeTab === "eyeglasses"
                          ? "bg-teal-600 text-white"
                          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      }`}
                    >
                      EYEGLASSES
                    </button>
                    <div className="flex items-center bg-gray-700 rounded-full p-1">
                      <button 
                        onClick={() => setViewMode("frames")}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                          viewMode === "frames"
                            ? "bg-gray-600 text-white"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        VIEW FRAMES
                      </button>
                      <button 
                        onClick={() => setViewMode("virtual")}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                          viewMode === "virtual"
                            ? "text-gray-900 golden-pulse"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        VIRTUAL TRY ON
                      </button>
                    </div>
                  </div>

                  {/* Right: Results Count and Sort */}
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-300">
                      Showing 15 of 729 Results
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300 font-medium">SORT BY</span>
                      <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="border border-gray-600 rounded-md px-3 py-2 text-sm bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="best-sellers">Best Sellers</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                        <option value="rating">Top Rated</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Grid - flows with page */}
              <div className="p-5 pb-8">
                <Grid columns={3} gap={4}>
                  {productCards}
                </Grid>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
});

SearchPage.displayName = "SearchPage";
