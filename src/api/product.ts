import { api } from "./axios";

export const getProducts = async (filters?: {
  category?: string;
  shape?: string;
  brand?: string;
  frameType?: string;
  color?: string;
  [key: string]: any;
}) => {
  const params: Record<string, any> = {};

  if (filters?.category) params.category = filters.category;
  if (filters?.shape) params.shape = filters.shape;
  if (filters?.brand) params.brand = filters.brand;
  if (filters?.frameType) params.frameType = filters.frameType;
  if (filters?.color) params.color = filters.color;

  const res = await api.get("/products", { params });

  return res.data;
};