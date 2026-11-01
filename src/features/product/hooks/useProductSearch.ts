import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SEARCH_FILTERS } from "@/features/product/constants";
import { getProducts } from "@/features/product/api/productApi";
import { getBrands } from "@/features/product/api/brandApi";
import { getBanners } from "@/features/home/api/bannerApi";
import { getOffers, getBestOfferBadge } from "@/features/offer/services/offerEngine";
import { isBannerVisible } from "@/shared/utils/banner";
import type { Offer, OfferBadge } from "@/features/offer/types";
import { getCategoryBySlug, isValidCategorySlug } from "@/features/home/api/categoryApi";
import { getLenses, getLensBrands } from "@/features/lens/api/lensApi";
import type { GetLensesParams, LensItem } from "@/features/lens/types";

function filtersToParams(
  filters: Record<string, string[]>,
  category?: string,
  shape?: string | null,
  collectionSlug?: string | null,
  brandFromQuery?: string | null,
  searchQuery?: string | null,
  sortBy?: string,
  cardId?: string | null,
  gender?: string | null,
  trending?: string | null,
): Record<string, any> {
  const params: Record<string, any> = { category };
  if (gender) params.gender = gender.toLowerCase();
  if (searchQuery) params.q = searchQuery;
  if (collectionSlug) params.collection = collectionSlug;
  if (brandFromQuery) params.brand = brandFromQuery;
  if (shape) params.shape = shape;
  if (cardId) params.cardId = cardId;
  if (trending) params.trending = trending;
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
  const [lenses, setLenses] = useState<LensItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const loadedCategoryRef = useRef<string | null>(null);
  const [lensPageState, setLensPageState] = useState<{ key: string; page: number }>({ key: "", page: 1 });
  const [pendingFilters, setPendingFilters] = useState<Record<string, string[]>>({});
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categoryBanner, setCategoryBanner] = useState<any>(null);
  const [filterConfig, setFilterConfig] = useState(SEARCH_FILTERS);
  const [applyCount, setApplyCount] = useState(0);
  const [isLensMode, setIsLensMode] = useState(false);
  const [lensModeResolved, setLensModeResolved] = useState(false);
  const [lensModeKey, setLensModeKey] = useState<string | null>(null);
  const [lensCategoryName, setLensCategoryName] = useState<string>("");
  const [resolvedLensCategory, setResolvedLensCategory] = useState<{ _id: string; name: string } | null>(null);
  const [lensPagination, setLensPagination] = useState<{ total: number; page: number; limit: number; totalPages: number } | null>(null);

  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const shape = searchParams.get("shape");
  const collectionSlug = searchParams.get("collection");
  const brandFromQuery = searchParams.get("brand");
  const modeKey = `${category ?? ""}|${brandFromQuery ?? ""}`;
  // Page belongs to the category/brand/filters/sort it was chosen under, so any
  // change of those falls back to page 1 without an extra render or request.
  const lensPageKey = `${modeKey}|${JSON.stringify(filters)}|${sortBy}`;
  const lensPage = lensPageState.key === lensPageKey ? lensPageState.page : 1;
  const setLensPage = useCallback(
    (page: number) => setLensPageState({ key: lensPageKey, page }),
    [lensPageKey]
  );
  const searchQuery = searchParams.get("q");
  const cardId = searchParams.get("cardId");
  const gender = searchParams.get("gender");
  const trending = searchParams.get("trending");

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
    let cancelled = false;

    setIsLensMode(false);
    setLensCategoryName("");
    setResolvedLensCategory(null);
    setLenses([]);
    setLensPagination(null);
    setLensModeResolved(false);

    if (!brandFromQuery && !category) {
      setLensModeResolved(true);
      setLensModeKey(modeKey);
      return;
    }

    if (brandFromQuery) {
      getLensBrands()
        .then((lensBrands) => {
          if (cancelled) return;
          const match = (lensBrands || []).find((b) => b._id === brandFromQuery);
          if (match) {
            setIsLensMode(true);
            setLensCategoryName(match.name || "");
          }
        })
        .catch(() => {
          // stay in frame mode if lens brands check fails
        })
        .finally(() => {
          if (cancelled) return;
          setLensModeResolved(true);
          setLensModeKey(modeKey);
        });
      return () => {
        cancelled = true;
      };
    }

    if (category) {
      getCategoryBySlug(category)
        .then((cat) => {
          if (cancelled) return;
          if (!cat) return;
          const type = (cat.type || "").toString().toLowerCase();
          if (type === "lens" || type === "lenses") {
            setIsLensMode(true);
            setResolvedLensCategory({ _id: cat._id, name: cat.name });
            setLensCategoryName(cat.name || "");
          }
        })
        .catch(() => {
          // stay in frame mode if category lookup fails
        })
        .finally(() => {
          if (cancelled) return;
          setLensModeResolved(true);
          setLensModeKey(modeKey);
        });
      return () => {
        cancelled = true;
      };
    }

    return () => {
      cancelled = true;
    };
  }, [category, brandFromQuery]);

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
    if (!lensModeResolved || lensModeKey !== modeKey) {
      // Full skeleton only for the first load or a category change; a brand or
      // filter change keeps the current results on screen.
      if (loadedCategoryRef.current !== (category ?? "")) setLoading(true);
      else setFetching(true);
      return;
    }

    if (category && !isValidCategorySlug(category)) {
      setProducts([]);
      setLenses([]);
      setLensPagination(null);
      loadedCategoryRef.current = category;
      setLoading(false);
      setFetching(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    setFetching(true);
    setFetchError(false);

    if (isLensMode) {
      const lensParams: GetLensesParams = {
        page: lensPage,
        limit: 20,
      };
      if (brandFromQuery) {
        lensParams.brand = brandFromQuery;
      }
      if (resolvedLensCategory?._id) {
        lensParams.category = resolvedLensCategory._id;
      }
      getLenses({ ...lensParams, signal: controller.signal })
        .then((res) => {
          if (cancelled) return;
          setLenses(Array.isArray(res.lenses) ? res.lenses : []);
          setLensPagination(res.pagination || null);
          setProducts([]);
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("Search lens API error:", err);
          setFetchError(true);
          setLenses([]);
          setLensPagination(null);
        })
        .finally(() => {
          if (cancelled) return;
          loadedCategoryRef.current = category ?? "";
          setLoading(false);
          setFetching(false);
        });
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    const params = filtersToParams(filters, category, shape, collectionSlug, brandFromQuery, searchQuery, sortBy, cardId, gender, trending);
    getProducts(params, controller.signal)
      .then((res) => {
        if (cancelled) return;
        const extracted = res.data?.data?.products || res.data?.products || res?.products || [];
        setProducts(extracted);
        setLenses([]);
        setLensPagination(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Search API error:", err);
        setFetchError(true);
      })
      .finally(() => {
        if (cancelled) return;
        loadedCategoryRef.current = category ?? "";
        setLoading(false);
        setFetching(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [category, shape, filters, collectionSlug, brandFromQuery, searchQuery, sortBy, cardId, gender, trending, isLensMode, lensModeResolved, lensModeKey, modeKey, resolvedLensCategory?._id, lensPage]);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  const handleFilterChange = useCallback((newFilters: Record<string, string[]>) => {
    setPendingFilters(newFilters);
  }, []);

  const applyFilters = useCallback(() => {
    setFilters(pendingFilters);
    setApplyCount((c) => c + 1);
    const sp = filtersToSearchParams(pendingFilters);
    if (trending) sp.trending = trending;
    setSearchParams(sp, { replace: true });
    setShowFilters(false);
  }, [pendingFilters, setSearchParams, trending]);

  const clearFilters = useCallback(() => {
    setPendingFilters({});
    setFilters({});
    setSearchParams({}, { replace: true });
    setShowFilters(false);
  }, [setSearchParams]);

  const clearTrending = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("trending");
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const getOfferBadge = useCallback((productId: string, price: number): OfferBadge | null => {
    return getBestOfferBadge(productId, price, offers);
  }, [offers]);

  const pendingCount = filtersCount(pendingFilters);

  return {
    products,
    lenses,
    isLensMode,
    lensCategoryName,
    lensPagination,
    lensPage,
    setLensPage,
    loading,
    fetching,
    fetchError,
    offers,
    sortBy,
    showFilters,
    pendingFilters,
    filters,
    filterConfig,
    category,
    categoryBanner,
    pendingCount,
    applyCount,
    trending,
    handleSortChange,
    handleFilterChange,
    applyFilters,
    clearFilters,
    clearTrending,
    setShowFilters,
    getOfferBadge,
  };
}
