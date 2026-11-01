import { api } from "@/shared/lib/axios";
import type { BrandItem, BrandsResponse } from "@/features/product/types";

export const getBrands = async (type: string = "frame"): Promise<BrandItem[]> => {
  const res = await api.get<BrandsResponse>("/brands", { params: { type } });
  // Safety net: frames only when requesting frames — legacy rows with no type are frames too.
  if (type === "frame") {
    return (res.data?.data?.brands || []).filter((b) => b.type === "frame" || !b.type);
  }
  return (res.data?.data?.brands || []).filter((b) => b.isActive !== false);
};

export const getAllBrands = async (type?: string): Promise<BrandItem[]> => {
  const res = await api.get<BrandsResponse>("/brands", type ? { params: { type } } : undefined);
  const brands = res.data?.data?.brands || [];
  return brands.filter((b) => b.isActive !== false);
};
