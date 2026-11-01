import { api } from "@/shared/lib/axios";

export interface CategoryApiItem {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  type?: string;
  isActive?: boolean;
  displayOrder?: number;
  order?: number;
}

export interface CategoriesResponse {
  success: boolean;
  message?: string;
  data:
    | {
        categories: CategoryApiItem[];
        pagination?: {
          page?: number;
          limit?: number;
          total?: number;
          totalPages?: number;
        };
      }
    | CategoryApiItem[];
}

const extractCategories = (data: CategoriesResponse["data"]): CategoryApiItem[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "categories" in data) {
    const categories = (data as { categories?: CategoryApiItem[] }).categories;
    return Array.isArray(categories) ? categories : [];
  }
  return [];
};

export const getAllCategories = async (type?: string): Promise<CategoryApiItem[]> => {
  try {
    const params: Record<string, string | number> = {};
    if (type) params.type = type;
    // Try to fetch a larger set in case of pagination/limits
    params.limit = 1000;
    params.page = 1;

    const res = await api.get<CategoriesResponse>("/categories", { params });
    const payload = res.data?.data;
    let categories = extractCategories(payload);

    // If paginated and there might be more pages, try to fetch remaining
    if (payload && !Array.isArray(payload) && "pagination" in payload) {
      const pagination = (payload as any).pagination || {};
      const totalPages = pagination.totalPages || 1;
      const currentPage = pagination.page || 1;
      if (totalPages > currentPage) {
        for (let page = currentPage + 1; page <= totalPages; page += 1) {
          try {
            const nextRes = await api.get<CategoriesResponse>("/categories", {
              params: { ...(type ? { type } : {}), limit: pagination.limit || 1000, page },
            });
            const nextPayload = nextRes.data?.data;
            categories = categories.concat(extractCategories(nextPayload));
          } catch {
            break;
          }
        }
      }
    }

    return categories.filter((c) => c.isActive !== false);
  } catch (error) {
    console.error("[getAllCategories] Failed to fetch categories:", error);
    throw error;
  }
};

export const isValidCategorySlug = (slug: string): boolean => /^[a-z0-9_-]+$/i.test(slug);

export const getCategoryBySlug = async (slug: string): Promise<CategoryApiItem | null> => {
  if (!isValidCategorySlug(slug)) return null;
  try {
    // The backend resolves GET /categories/:id for both ids and slugs, so try it
    // first. The /categories/slug/:slug route 404s and wastes a request.
    try {
      const res = await api.get(`/categories/${encodeURIComponent(slug)}`);
      const data = res.data?.data?.category || res.data?.data || res.data?.category || res.data;
      if (Array.isArray(data)) {
        const found = data.find((c: CategoryApiItem) => (c.slug === slug || c._id === slug) && c.isActive !== false);
        if (found) return found;
      } else if (data && typeof data === "object") {
        const cat = data as CategoryApiItem;
        if (cat.isActive !== false) return cat;
      }
    } catch {
      // fall through to alternative routes
    }

    // Try the explicit slug route as a fallback
    try {
      const res = await api.get(`/categories/slug/${encodeURIComponent(slug)}`);
      const data = res.data?.data?.category || res.data?.data || res.data?.category || res.data;
      if (Array.isArray(data)) {
        const found = data.find((c: CategoryApiItem) => c.slug === slug && c.isActive !== false);
        if (found) return found;
      } else if (data && typeof data === "object") {
        const cat = data as CategoryApiItem;
        if (cat.isActive !== false) return cat;
      }
    } catch {
      // fall through
    }

    // Try query by slug
    try {
      const res = await api.get(`/categories`, { params: { slug } });
      const payload = res.data?.data;
      let categories: CategoryApiItem[] = [];
      if (Array.isArray(payload)) {
        categories = payload;
      } else if (payload && typeof payload === "object" && "categories" in payload) {
        const cats = (payload as { categories?: CategoryApiItem[] }).categories;
        categories = Array.isArray(cats) ? cats : [];
      }
      const found = categories.find((c) => c.slug === slug && c.isActive !== false);
      if (found) return found;
    } catch {
      // ignore
    }

    return null;
  } catch {
    return null;
  }
};
