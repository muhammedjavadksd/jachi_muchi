import { api } from "@/shared/lib/axios";
import type { LensItem, LensResponse } from "@/features/lens/types";

export const getLenses = async (type: string): Promise<LensItem[]> => {
  const res = await api.get<LensResponse>(`/lens?type=${type}`);
  return res.data.data.lenses || [];
};
