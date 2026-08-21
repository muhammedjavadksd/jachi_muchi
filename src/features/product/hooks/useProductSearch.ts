import { useState, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SEARCH_FILTERS } from "@/features/product/constants";
import { getProducts } from "@/features/product/api/productApi";
import { getBrands } from "@/features/product/api/brandApi";
import { getBanners } from "@/features/home/api/bannerApi";
import { getOffers, getBestOfferBadge } from "@/features/offer/services/offerEngine";
import { isBannerVisible } from "@/shared/utils/banner";
import type { Offer, OfferBadge } from "@/features/offer/types";

function filtersToParams(
  filters: Record<string, string[]>,
  category?: string,
  shape?: string | null,
  collectionSlug?: string | null,
  brandFromQuery?: string | null,
  searchQuery?: string | null,
  sortBy?: string,
): Record<string, any> {
  const params: Record<string, any> = { category };
  if (searchQuery) params.q = searchQuery;
  if (collectionSlug) params.collection = collectionSlug;
  if (brandFromQuery) params.brand = brandFromQuery;
  if (shape) params.shape = shape;
  if (filters["frame-shape"]?.length) params.shape = filters["frame-shape"].join(",");
  if (filters["frame-type"]?.length) params.frameType = filters["frame-type"].join(",");
  if (filters["frame-color"]?.length) params.color = filters["frame-color"].join(",");
  if (filters["brands"]?.length) params.brand = filters["brands"].join(",");
  params.sortBy = sortBy || "best-sellers";
  return params;
}

function filtersToSearchParams(filters: Record<string, string[]>): Record<string, string> {
  const sp: Record<string, string> = {};
  if (filters["frame-shape"]?.length) sp.shape = filters["frame-shape"].join(",");
  if (filters["frame-type"]?.length) sp.frameType = filters["frame-type"].join(",");
  if (filters["frame-color"]?.length) sp.color = filters["frame-color"].join(",");
  if (filters["brands"]?.length) sp.brand = filters["brands"].join(",");
  return sp;
}

function filtersCount(filters: Record<string, string[]>): number {
  return Object.values(filters).reduce((sum, arr) => sum + (arr?.length || 0), 0);
}

export function useProductSearch() {
  const [sortBy, setSortBy] = useState("best-sellers");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<Record<string, string[]>>({});
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categoryBanner, setCategoryBanner] = useState<any>(null);
  const [filterConfig, setFilterConfig] = useState(SEARCH_FILTERS);
  const [applyCount, setApplyCount] = useState(0);

  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const shape = searchParams.get("shape");
  const collectionSlug = searchParams.get("collection");
  const brandFromQuery = searchParams.get("brand");
  const searchQuery = searchParams.get("q");

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
      getBanners().then((allBanners: any[]) => {
        const now = Date.now();
        const found = allBanners.find((b: any) =>
          isBannerVisible(b, now) &&
          b.type === "category" &&
          (b.title?.toLowerCase() === category?.toLowerCase() || b.redirectUrl?.includes(category))
        );
        setCategoryBanner(found);
      }).catch(() => setCategoryBanner(null));
    } else {
      setCategoryBanner(null);
    }
  }, [category]);

  useEffect(() => {
    setFetching(true);
    const params = filtersToParams(filters, category, shape, collectionSlug, brandFromQuery, searchQuery, sortBy);
    getProducts(params)
      .then((res) => {
        const extracted = res.data?.data?.products || res.data?.products || res?.products || [];
        setProducts(extracted);
      })
      .catch((err) => {
        console.error("Search API error:", err);
      })
      .finally(() => {
        setLoading(false);
        setFetching(false);
      });
  }, [category, shape, filters, collectionSlug, brandFromQuery, searchQuery, sortBy]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  }, []);

  const handleFilterChange = useCallback((newFilters: Record<string, string[]>) => {
    setPendingFilters(newFilters);
  }, []);

  const applyFilters = useCallback(() => {
    setFilters(pendingFilters);
    setApplyCount((c) => c + 1);
    const sp = filtersToSearchParams(pendingFilters);
    setSearchParams(sp, { replace: true });
    setShowFilters(false);
  }, [pendingFilters, setSearchParams]);

  const clearFilters = useCallback(() => {
    setPendingFilters({});
    setFilters({});
    setSearchParams({}, { replace: true });
    setShowFilters(false);
  }, [setSearchParams]);

  const getOfferBadge = useCallback((productId: string, price: number): OfferBadge | null => {
    return getBestOfferBadge(productId, price, offers);
  }, [offers]);

  const pendingCount = filtersCount(pendingFilters);

  return {
    products,
    loading,
    fetching,
    offers,
    sortBy,
    showFilters,
    pendingFilters,
    filters,
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
  };
}
