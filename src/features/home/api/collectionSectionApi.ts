import { api } from "@/shared/lib/axios";
import type { CollectionSection } from "@/features/home/types";

let sectionsRequest: Promise<CollectionSection[]> | null = null;

const fetchCollectionSections = async (): Promise<CollectionSection[]> => {
  const response = await api.get("/collection-sections");
  return response.data?.data?.sections || [];
};

export const getCollectionSections = (): Promise<CollectionSection[]> => {
  if (!sectionsRequest) {
    sectionsRequest = fetchCollectionSections().catch((error) => {
      sectionsRequest = null;
      console.error("Error fetching collection sections:", error);
      return [] as CollectionSection[];
    });
  }
  return sectionsRequest;
};
