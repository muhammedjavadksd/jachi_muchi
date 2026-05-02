import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";
import { Grid } from "../../components/Grid/Grid";
import { FilterSidebar } from "../../components/FilterSidebar/FilterSidebar";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { useParams, useSearchParams } from "react-router-dom";

import { SEARCH_FILTERS } from "../../lib/constants";
import { X, SlidersHorizontal } from "lucide-react";
import { getProducts } from "../../api/product";

const PROMOTION_HEADER_HEIGHT = 140;

export const SearchPage = memo(function SearchPage(): JSX.Element {
  const [sortBy, setSortBy] = useState("best-sellers");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const shape = searchParams.get("shape");

  // ✅ API CALL
  useEffect(() => {
    setLoading(true);

    getProducts({
      category,
      shape,
    })
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .finally(() => setLoading(false));
  }, [category, shape]);

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
    (filters: Record<string, string[]>) => {
      console.log("Filters changed:", filters);
      // future filtering logic
    },
    []
  );

  const productCards = useMemo(
    () =>
      products.map((product: any, index) => (
        <ProductCard
          key={product._id || index}
          images={
            product.images && product.images.length > 0
              ? product.images
              : ["/placeholder.png"]
          }
          name={product.name}
          description={product.description || ""}
          price={product.price}
          originalPrice={product.originalPrice || product.price}
          discount={product.discount || 0}
          rating={product.rating || 4}
          reviews={product.reviews || 0}
          colors={product.colors || []}
          link={`/product/${product._id}`}
        />
      )),
    [products]
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
                  filters={SEARCH_FILTERS}
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
                <Grid columns={1} sm={2} lg={3} xl={4} gap={5}>
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