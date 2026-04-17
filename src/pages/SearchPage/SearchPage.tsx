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

const PROMOTION_HEADER_HEIGHT = 140;

export const SearchPage = memo(function SearchPage(): JSX.Element {
  const [sortBy, setSortBy] = useState("best-sellers");
  const [activeTab, setActiveTab] = useState("eyeglasses");
  const [viewMode, setViewMode] = useState<"frames" | "virtual">("frames");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  }, []);

  const handleFilterChange = useCallback((filters: Record<string, string[]>) => {
    console.log("Filters changed:", filters);
  }, []);

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
      <PromotionHeader />
      <div style={spacerStyle} />

      {/* Mobile Filter Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-xl overflow-y-auto transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="font-semibold text-gray-800">Filters</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          <FilterSidebar
            filters={SEARCH_FILTERS}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <main className="flex-1">
        <Container>
          <div className="flex gap-6 xl:gap-8 pt-4 sm:pt-6">

            {/* Desktop Sidebar */}
            <div
              className="hidden lg:block w-56 xl:w-64 shrink-0 self-start sticky overflow-y-auto pr-4 pb-6 scrollbar-thin"
              style={{
                top: `${PROMOTION_HEADER_HEIGHT}px`,
                maxHeight: `calc(100vh - ${PROMOTION_HEADER_HEIGHT}px)`
              }}
            >
              <FilterSidebar
                filters={SEARCH_FILTERS}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Product Listing */}
            <div className="flex-1 min-w-0 border-t border-l border-gray-200 rounded-tl-lg overflow-hidden">

              {/* Header Bar */}
              <div className="bg-gray-800 px-3 sm:px-5 py-3 sm:py-4">

                {/* Mobile header: filter button + sort */}
                <div className="flex items-center justify-between lg:hidden">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white text-xs font-semibold rounded-full"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="6" x2="20" y2="6"/>
                      <line x1="4" y1="12" x2="16" y2="12"/>
                      <line x1="4" y1="18" x2="12" y2="18"/>
                    </svg>
                    FILTERS
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300 hidden sm:block">SORT BY</span>
                    <select
                      value={sortBy}
                      onChange={handleSortChange}
                      className="border border-gray-600 rounded-md px-2 py-1.5 text-xs bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="best-sellers">Best Sellers</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>

                {/* Mobile: tabs row */}
                <div className="flex items-center gap-2 mt-2 lg:hidden">
                  <button
                    onClick={() => setActiveTab("eyeglasses")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                      activeTab === "eyeglasses"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    EYEGLASSES
                  </button>
                  <div className="flex items-center bg-gray-700 rounded-full p-0.5">
                    <button
                      onClick={() => setViewMode("frames")}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        viewMode === "frames"
                          ? "bg-gray-600 text-white"
                          : "text-gray-400"
                      }`}
                    >
                      FRAMES
                    </button>
                    <button
                      onClick={() => setViewMode("virtual")}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        viewMode === "virtual"
                          ? "text-gray-900 golden-pulse"
                          : "text-gray-400"
                      }`}
                    >
                      TRY ON
                    </button>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">729 results</span>
                </div>

                {/* Desktop header: original layout */}
                <div className="hidden lg:flex items-center justify-between">
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

              {/* Product Grid */}
              <div className="p-3 sm:p-5 pb-8">
                <Grid
                  columns={2}
                  gap={3}
                  className="sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                >
                  {productCards}
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