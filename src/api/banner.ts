// src/api/banner.ts
import { api } from "./axios";
import type { Banner } from "../types";

export const getBanners = async (): Promise<Banner[]> => {
  try {
    const response = await api.get("/banners");
    return response.data?.data?.banners || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};