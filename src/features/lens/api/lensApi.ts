import { api } from "@/shared/lib/axios";
import { LENS_SIMILAR_LIMIT } from "@/features/lens/constants";
import { getLensId } from "@/features/lens/utils/detail";
import type {
  GetLensesParams,
  LensBrand,
  LensBrandsResponse,
  LensDetailResponse,
  LensItem,
  LensListResult,
  LensResponse,
} from "@/features/lens/types";

export const getLensBrands = async (type?: string): Promise<LensBrand[]> => {
  try {
    const res = await api.get<LensBrandsResponse>("/lens/brands", {
      params: type ? { type } : undefined,
    });
    return res.data?.data?.brands ?? [];
  } catch {
    try {
      const res = await api.get<LensBrandsResponse>("/lens/brands");
      return res.data?.data?.brands ?? [];
    } catch {
      return [];
    }
  }
};

export const getLenses = async (params: GetLensesParams): Promise<LensListResult> => {
  const {
    type,
    brand,
    brandId,
    categoryId,
    category,
    page = 1,
    limit = 20,
    signal,
    ...rest
  } = params;

  const finalBrand = brand || brandId;
  const finalCategory = categoryId || category;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (typeof type === "string" && type.length > 0) {
    queryParams.set("type", type);
  }
  if (typeof finalBrand === "string" && finalBrand.length > 0) {
    queryParams.set("brand", finalBrand);
  }
  if (typeof finalCategory === "string" && finalCategory.length > 0) {
    // Backend expects the category as an ObjectId
    queryParams.set("category", finalCategory);
  }

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.set(key, String(value));
    }
  });

  const res = await api.get<LensResponse>(`/lens?${queryParams.toString()}`, { signal });
  const data = res.data?.data;
  const lenses = data?.lenses ?? [];
  const pagination = data?.pagination;

  return {
    lenses,
    pagination: {
      total: pagination?.total ?? lenses.length,
      page: pagination?.page ?? Number(page),
      limit: pagination?.limit ?? Number(limit),
      totalPages:
        pagination?.totalPages ??
        Math.ceil((pagination?.total ?? lenses.length) / Number(limit) || 1),
    },
  };
};

export const getLensById = async (
  id: string,
  signal?: AbortSignal
): Promise<LensItem | null> => {
  if (!id) return null;

  const res = await api.get<LensDetailResponse>(
    `/lens/${encodeURIComponent(id)}`,
    { signal }
  );

  return res.data?.data?.lens ?? null;
};

export const getSimilarLenses = async (
  categoryId: string,
  excludeId: string,
  signal?: AbortSignal
): Promise<LensItem[]> => {
  const result = await getLenses({
    categoryId,
    limit: LENS_SIMILAR_LIMIT,
    signal,
  });

  return result.lenses
    .filter((lens) => getLensId(lens) !== excludeId)
    .slice(0, LENS_SIMILAR_LIMIT);
};
