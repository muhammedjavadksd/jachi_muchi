export interface LensCategory {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
}

export interface LensPowerRange {
  sphPlus?: number | null;
  sphMinus?: number | null;
  cylMax?: number | null;
  totalMax?: number | null;
}

export interface LensAdditionRange {
  min?: number | null;
  max?: number | null;
}

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
  category?: LensCategory | string | null;
  design?: string | null;
  material?: string;
  coating?: string;
  blueUV?: boolean;
  photochromic?: string | null;
  photochromicColors?: string[];
  xperioType?: string | null;
  corridor?: string | null;
  boostAddition?: string | null;
  power?: LensPowerRange | null;
  addition?: LensAdditionRange | null;
  stockType?: string | null;
  leadTimeDays?: number | null;
  active?: boolean;
  isActive?: boolean;
  description?: string | null;
  index?: number | string;
  lensIndex?: number | string;
  refractiveIndex?: number | string;
  image?: string;
  brand?: { _id?: string; id?: string; logo?: string; name?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export type LensEye = "right" | "left";
export type LensPowerField = "sph" | "cyl" | "add";

export interface LensEyeValues {
  sph: string;
  cyl: string;
  add: string;
}

export interface LensPowerFieldConfig {
  key: LensPowerField;
  label: string;
  values: string[];
}

export interface LensPowerSelectionState {
  selectedEyes: Record<LensEye, boolean>;
  values: Record<LensEye, LensEyeValues>;
}

export interface LensPowerDetails {
  leftSPH?: string;
  rightSPH?: string;
  leftCYL?: string;
  rightCYL?: string;
  leftADD?: string;
  rightADD?: string;
  isSamePower?: boolean;
  hasCylindrical?: boolean;
  customerName?: string;
  customerPhone?: string;
  knowPowerLater?: boolean;
  powerMethod?: "later" | "manual" | "upload";
}

export interface LensSortOption {
  value: "best-sellers" | "price-low" | "price-high" | "newest";
  label: string;
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

export interface LensDetailResponse {
  success: boolean;
  message?: string;
  data: {
    lens: LensItem;
  };
}

export interface GetLensesParams {
  type?: "with_power" | "zero_power" | "progressive" | string;
  brand?: string;
  brandId?: string;
  categoryId?: string;
  category?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
  [key: string]: unknown;
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
