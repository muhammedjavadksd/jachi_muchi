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
  material?: string;
  coating?: string;
  index?: number | string;
  lensIndex?: number | string;
  refractiveIndex?: number | string;
  image?: string;
  brand?: { _id?: string; id?: string; logo?: string; name?: string } | null;
}

export interface LensBrand {
  _id: string;
  name: string;
  logo?: string;
  lensCount?: number;
}

export interface LensPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LensResponse {
  success: boolean;
  message?: string;
  data: {
    lenses: LensItem[];
    pagination?: LensPagination;
  };
}

export interface GetLensesParams {
  type: "with_power" | "zero_power" | "progressive";
  brand: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export interface LensListResult {
  lenses: LensItem[];
  pagination: LensPagination;
}

export interface LensBrandsResponse {
  success: boolean;
  message?: string;
  data: {
    brands: LensBrand[];
  };
}

export interface TransitionOption {
  id: string;
  name: string;
  price: number;
  colors: string[];
}

export interface SelectedTransition {
  id: string;
  name: string;
  color: string;
  price: number;
}
