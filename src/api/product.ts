import { api } from "./axios";

export const getProducts = async (filters?: {
  category?: string;
  shape?: string;
  brand?: string;
  frameType?: string;
  color?: string;
  collection?: string;
  [key: string]: any;
}) => {
  const params: Record<string, any> = {};

  if (filters?.category) params.category = filters.category;
  if (filters?.shape) params.shape = filters.shape;
  if (filters?.brand) params.brand = filters.brand;
  if (filters?.frameType) params.frameType = filters.frameType;
  if (filters?.color) params.color = filters.color;

  if (filters?.collection) params.collection = filters.collection;

  const res = await api.get("/products", { params });

  return res.data;
};

export interface ProductDetailData {
  _id: string;
  name: string;
  subtitle?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  ratingCount?: number;
  images?: string[];
  colors?: { name: string; hex?: string; image?: string }[];
  description?: string;
  brand?: string;
  frameType?: string;
  shape?: string;
  inStock?: boolean;
}

export const getProductById = async (id: string): Promise<ProductDetailData | null> => {
  try {
    const res = await api.get(`/products/${id}`);
    const data = res.data?.data || res.data?.product || res.data;
    return data || null;
  } catch {
    return null;
  }
};

export const getSimilarProducts = async (id: string): Promise<any[]> => {
  try {
    const res = await api.get(`/products/${id}/similar`);
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};