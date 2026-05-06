import { api } from "./axios";

export interface LensItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  features?: string[];
  warranty?: string;
  badge?: string;
  type?: string;
}

export interface LensResponse {
  success: boolean;
  message: string;
  data: {
    lenses: LensItem[];
  };
}

export const getLenses = async (type: string): Promise<LensItem[]> => {
  const res = await api.get<LensResponse>(`/lens?type=${type}`);
  return res.data.data.lenses || [];
};
