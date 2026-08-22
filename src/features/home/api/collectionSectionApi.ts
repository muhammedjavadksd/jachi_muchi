import { api } from "@/shared/lib/axios";
import type { CollectionSection } from "@/features/home/types";

export const getCollectionSections = async (): Promise<CollectionSection[]> => {
  try {
    const response = await api.get("/collection-sections");
    return response.data?.data?.sections || [];
  } catch (error) {
    console.error("Error fetching collection sections:", error);
    return [];
  }
};
