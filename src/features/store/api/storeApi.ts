import { api } from "@/shared/lib/axios";
import type { Store } from "@/features/store/types";

export interface NearestStoreResult {
  store: Store;
  distance: number;
}

export const getStores = async (): Promise<Store[]> => {
  try {
    const res = await api.get("/public/stores");
    const stores = res.data?.data || [];
    return Array.isArray(stores) ? stores : [];
  } catch {
    return [];
  }
};

export const findNearestStore = async (lat: number, lng: number): Promise<NearestStoreResult | null> => {
  try {
    const res = await api.get(`/public/stores/nearest?lat=${lat}&lng=${lng}`);
    const data = res.data?.data;
    if (data?.store) {
      return { store: data.store, distance: data.distance };
    }
    return null;
  } catch {
    return null;
  }
};

export const getStoreCount = async (): Promise<number> => {
  try {
    const stores = await getStores();
    return stores.filter((s) => s.isActive).length;
  } catch {
    return 0;
  }
};
