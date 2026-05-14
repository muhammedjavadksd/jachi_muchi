import { api } from "../api/axios";
import type { Offer, OffersApiResponse } from "../types/offers.types";

export async function getActiveOffers(): Promise<Offer[]> {
  try {
    const response = await api.get<OffersApiResponse>("/offers/active");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching active offers:", error);
    return [];
  }
}
