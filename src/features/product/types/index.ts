import type { ColorVariant } from "@/shared/types";

export interface ProductCardProps {
  images: string[];
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  colors?: ColorVariant[];
  link: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductDetail {
  id: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  images: string[];
  rotation360Images?: string[];
  colors: ColorVariant[];
  specs: ProductSpec[];
  features: string[];
  longDescription?: string;
  offerBadge?: string;
}

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
  rotation360Images?: string[];
  colors?: { name: string; hex?: string; image?: string }[];
  description?: string;
  brand?: string;
  frameType?: string;
  shape?: string;
  inStock?: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  icon?: string;
  color?: string;
}

export interface FilterGroup {
  id: string;
  title: string;
  type: "checkbox" | "shape" | "color";
  options: FilterOption[];
  collapsible?: boolean;
}

export interface FilterSidebarProps {
  filters: FilterGroup[];
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

export interface BrandItem {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  isActive?: boolean;
}

export interface BrandsResponse {
  success: boolean;
  message: string;
  data: {
    brands: BrandItem[];
  };
}

export interface CategoryNavItem {
  id: string;
  label: string;
  link: string;
}

export interface CategoryNavProps {
  categories: CategoryNavItem[];
  activeCategory?: string;
}

export interface SearchResult {
  suggestions: string[];
  categories: string[];
}
