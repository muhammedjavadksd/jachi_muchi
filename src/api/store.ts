import { api } from "./axios";
import type { Store } from "../types";

export const getStores = async (): Promise<Store[]> => {
  try {
    const res = await api.get("/stores");
    const stores = res.data?.data?.stores || [];
    return Array.isArray(stores) ? stores : [];
  } catch {
    return [];
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
