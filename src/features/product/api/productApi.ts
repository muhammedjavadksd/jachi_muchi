import { api } from "@/shared/lib/axios";
import type { ProductDetailData } from "@/features/product/types";

// export const getProducts = async (filters?: {
//   category?: string;
//   shape?: string;
//   brand?: string;
//   frameType?: string;
//   color?: string;
//   collection?: string;
//   q?: string;
//   sortBy?: string;
//   [key: string]: any;
// }) => {
//   const params: Record<string, any> = {};

//   if (filters?.category) params.category = filters.category;
//   if (filters?.q) params.q = filters.q;
//   if (filters?.shape) params.shape = filters.shape;
//   if (filters?.brand) params.brand = filters.brand;
//   if (filters?.frameType) params.frameType = filters.frameType;
//   if (filters?.color) params.color = filters.color;
//   if (filters?.collection) params.collection = filters.collection;
//   if (filters?.sortBy) params.sortBy = filters.sortBy;

//   const res = await api.get("/products", { params });
//   return res.data;
// };


export const getProducts = async (filters?: {
  category?: string;
  shape?: string;
  brand?: string;
  frameType?: string;
  color?: string;
  collection?: string;
  q?: string;
  sortBy?: string;
  limit?: number;      // ← added
  page?: number;       // ← added
  [key: string]: any;
}) => {
  const params: Record<string, any> = {};

  if (filters?.category) params.category = filters.category;
  if (filters?.q) params.q = filters.q;
  if (filters?.shape) params.shape = filters.shape;
  if (filters?.brand) params.brand = filters.brand;
  if (filters?.frameType) params.frameType = filters.frameType;
  if (filters?.color) params.color = filters.color;
  if (filters?.collection) params.collection = filters.collection;
  if (filters?.sortBy) params.sortBy = filters.sortBy;

  // ↓ added: always fetch everything by default
  params.limit = filters?.limit ?? 1000;
  if (filters?.page) params.page = filters.page;

  const res = await api.get("/products", { params });
  return res.data;
};

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
