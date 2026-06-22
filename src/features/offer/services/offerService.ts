import { api } from "@/shared/lib/axios";
import type { Offer, OffersApiResponse } from "@/features/offer/types";

export async function getActiveOffers(): Promise<Offer[]> {
  try {
    const response = await api.get<OffersApiResponse>("/offers/active");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching active offers:", error);
    return [];
  }
}
