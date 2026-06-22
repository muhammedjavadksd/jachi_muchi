import { api } from "@/shared/lib/axios";
import type { Banner } from "@/features/home/types";

export const getBanners = async (): Promise<Banner[]> => {
  try {
    const response = await api.get("/banners");
    return response.data?.data?.banners || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};
