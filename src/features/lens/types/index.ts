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
  image?: string;
  brand?: { logo?: string; name?: string } | null;
}

export interface LensResponse {
  success: boolean;
  message: string;
  data: {
    lenses: LensItem[];
  };
}
