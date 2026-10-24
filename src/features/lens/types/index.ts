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
  index?: number | string;
  lensIndex?: number | string;
  refractiveIndex?: number | string;
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
