import { api } from "./axios";

export interface BrandItem {
  _id: string;
  name: string;
}

export interface BrandsResponse {
  success: boolean;
  message: string;
  data: {
    brands: BrandItem[];
  };
}

export const getBrands = async (): Promise<BrandItem[]> => {
  const res = await api.get<BrandsResponse>("/brands");
  return res.data.data.brands || [];
};
