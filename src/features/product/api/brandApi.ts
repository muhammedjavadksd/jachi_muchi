import { api } from "@/shared/lib/axios";
import type { BrandItem, BrandsResponse } from "@/features/product/types";

export const getBrands = async (): Promise<BrandItem[]> => {
  const res = await api.get<BrandsResponse>("/brands");
  return res.data?.data?.brands || [];
};
