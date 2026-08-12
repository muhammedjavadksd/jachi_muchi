import { useState, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SEARCH_FILTERS } from "@/features/product/constants";
import { getProducts } from "@/features/product/api/productApi";
import { getBrands } from "@/features/product/api/brandApi";
import { getBanners } from "@/features/home/api/bannerApi";
import { getOffers, getBestOfferBadge } from "@/features/offer/services/offerEngine";
import { isBannerVisible } from "@/shared/utils/banner";
import type { Offer, OfferBadge } from "@/features/offer/types";

export function useProductSearch() {
  const [sortBy, setSortBy] = useState("best-sellers");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categoryBanner, setCategoryBanner] = useState<any>(null);
  const [filterConfig, setFilterConfig] = useState(SEARCH_FILTERS);

  const { category } = useParams();
  const [searchParams] = useSearchParams();
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
    const params: Record<string, any> = { category };
    if (searchQuery) params.q = searchQuery;
    if (collectionSlug) params.collection = collectionSlug;
    if (brandFromQuery) params.brand = brandFromQuery;
    if (shape) params.shape = shape;
    if (filters["frame-shape"]?.length) params.shape = filters["frame-shape"].join(",");
    if (filters["frame-type"]?.length) params.frameType = filters["frame-type"].join(",");
    if (filters["frame-color"]?.length) params.color = filters["frame-color"].join(",");
    if (filters["brands"]?.length) params.brand = filters["brands"].join(",");
    params.sortBy = sortBy;

    console.log("Search query:", searchQuery);
    console.log("Request params:", params);
    getProducts(params)
      .then((res) => {
        console.log("API response:", res);
        const extracted = res.data?.data?.products || res.data?.products || res?.products || [];
        console.log("Extracted products count:", extracted.length);
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
    setFilters(newFilters);
  }, []);

  const getOfferBadge = useCallback((productId: string, price: number): OfferBadge | null => {
    return getBestOfferBadge(productId, price, offers);
  }, [offers]);

  return {
    products,
    loading,
    fetching,
    offers,
    sortBy,
    showFilters,
    filters,
    filterConfig,
    categoryBanner,
    handleSortChange,
    handleFilterChange,
    setShowFilters,
    getOfferBadge,
  };
}
