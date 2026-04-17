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
import { X, SlidersHorizontal } from "lucide-react"; // Add these icons (or use your own)

const PROMOTION_HEADER_HEIGHT = 140;

export const SearchPage = memo(function SearchPage(): JSX.Element {
  const [sortBy, setSortBy] = useState("best-sellers");
  const [activeTab, setActiveTab] = useState("eyeglasses");
  const [viewMode, setViewMode] = useState<"frames" | "virtual">("frames");
  const [showFilters, setShowFilters] = useState(false);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  }, []);

  const handleFilterChange = useCallback((filters: Record<string, string[]>) => {
    console.log("Filters changed:", filters);
    // TODO: Apply filtering logic
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
      {/* Promotion Header */}
      <PromotionHeader />
      
      {/* Spacer */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1">
        <Container>
          <div className="flex flex-col lg:flex-row gap-6 pt-6 pb-12">
            
            {/* Filter Sidebar - Desktop: Sticky | Mobile: Drawer */}
            <div className={`
              lg:w-72 lg:shrink-0 lg:self-start lg:sticky lg:overflow-y-auto
              ${showFilters ? 'fixed inset-0 z-50 bg-white lg:relative' : 'hidden lg:block'}
            `}>
              {/* Mobile Header for Drawer */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-2"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="lg:pr-4 lg:pb-6 p-4 lg:p-0">
                <FilterSidebar 
                  filters={SEARCH_FILTERS}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {/* Apply button for mobile */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50">
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Product Listing Area */}
            <div className="flex-1 min-w-0">
              {/* Dark Header with Tabs + Sort */}
              <div className="bg-gray-900 text-white rounded-t-2xl lg:rounded-tl-2xl overflow-hidden">
                <div className="px-4 py-4 lg:px-6 lg:py-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Tabs & View Mode */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab("eyeglasses")}
                        className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all ${
                          activeTab === "eyeglasses"
                            ? "bg-teal-600 text-white shadow-sm"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        EYEGLASSES
                      </button>

                      <div className="flex items-center bg-gray-800 rounded-full p-1">
                        <button 
                          onClick={() => setViewMode("frames")}
                          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all ${
                            viewMode === "frames"
                              ? "bg-gray-700 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          FRAMES
                        </button>
                        <button 
                          onClick={() => setViewMode("virtual")}
                          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all ${
                            viewMode === "virtual"
                              ? "bg-amber-400 text-gray-900 font-bold"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          VIRTUAL TRY-ON
                        </button>
                      </div>
                    </div>

                    {/* Mobile Filters Button + Results + Sort */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <button 
                        onClick={() => setShowFilters(true)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl text-sm font-medium"
                      >
                        <SlidersHorizontal size={18} />
                        Filters
                      </button>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400 hidden sm:inline">
                          Showing 15 of 729
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium whitespace-nowrap">SORT:</span>
                          <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                </div>
              </div>

              {/* Product Grid */}
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl p-4 lg:p-6">
                <Grid 
                  columns={1} 
                  sm={2} 
                  lg={3} 
                  xl={4} 
                  gap={5}
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