import { api } from "@/shared/lib/axios";
import type { BrandItem, BrandsResponse } from "@/features/product/types";

export const getBrands = async (): Promise<BrandItem[]> => {
  const res = await api.get<BrandsResponse>("/brands", { params: { type: "frame" } });
  // Safety net: frames only — legacy rows with no type are frames too.
  return (res.data?.data?.brands || []).filter((b) => b.type === "frame" || !b.type);
};
