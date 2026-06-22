import { api } from "@/shared/lib/axios";
import type { Settings } from "@/features/account/types";

export const getSettings = async (): Promise<Settings | null> => {
  try {
    const res = await api.get("/settings");
    return res.data?.data || null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};
