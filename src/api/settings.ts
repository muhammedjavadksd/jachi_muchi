import { api } from "./axios";

export interface Settings {
  _id: string;
  siteName: string;
  supportEmail: string;
  contactPhone: string;
  currency: string;
  taxPercentage: number;
  shippingCharge: number;
  freeShippingThreshold: number;
  whatsappNumber: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  storeAddress?: string;
  minOrderAmount?: number;
  deliveryTimeDays?: string;
}

export const getSettings = async (): Promise<Settings | null> => {
  try {
    const res = await api.get("/settings");
    return res.data?.data || null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};
