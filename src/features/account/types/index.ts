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
