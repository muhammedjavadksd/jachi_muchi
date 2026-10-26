import { api } from "@/shared/lib/axios";
import type {
  GetLensesParams,
  LensBrand,
  LensBrandsResponse,
  LensListResult,
  LensResponse,
} from "@/features/lens/types";

export const getLensBrands = async (type: string): Promise<LensBrand[]> => {
  const res = await api.get<LensBrandsResponse>(`/lens/brands?type=${type}`);
  return res.data.data.brands || [];
};

export const getLenses = async ({
  type,
  brand,
  page = 1,
  limit = 10,
  signal,
}: GetLensesParams): Promise<LensListResult> => {
  if (!type || typeof type !== "string") {
    console.error("[getLenses] Missing or invalid type:", { type, brand, page, limit });
    throw new Error("getLenses requires a valid type");
  }
  if (!brand || typeof brand !== "string") {
    console.error("[getLenses] Missing or invalid brand:", { type, brand, page, limit });
    throw new Error("getLenses requires a valid brand");
  }

  const params = new URLSearchParams({
    type,
    brand,
    page: String(page),
    limit: String(limit),
  });

  const res = await api.get<LensResponse>(`/lens?${params.toString()}`, { signal });
  const payload = res.data.data;
  const lenses = payload.lenses || [];
  const pagination = payload.pagination;

  return {
    lenses,
    pagination: {
      total: pagination?.total ?? lenses.length,
      page: pagination?.page ?? page,
      limit: pagination?.limit ?? limit,
      totalPages:
        pagination?.totalPages ??
        Math.ceil((pagination?.total ?? lenses.length) / limit),
    },
  };
};
