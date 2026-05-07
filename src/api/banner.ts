// src/api/banner.ts
import { api } from "./axios";

export const getBanners = async () => {
  try {
    const response = await api.get("/banners");
    return response.data?.data?.banners || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};