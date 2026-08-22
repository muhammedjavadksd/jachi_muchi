import type { ReactNode } from "react";

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  redirectUrl?: string;
  type: "homepage" | "promotional";
  position: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ShapeItem {
  label: string;
  image: string;
  link?: string;
}

export interface CategoryItem {
  name: string;
  label: string;
  image: string;
  link: string;
  badge?: string;
}

export interface ProductItem {
  name: string;
  price: string;
  tag?: string;
}

export interface BrandItem {
  name: string;
  logo?: string;
}

export type ShapeType = "circle" | "box";

export interface NearbyServiceItem {
  title: string;
  image: string;
  link: string;
}

export interface ExclusiveItem {
  title: string;
  image: string;
  link: string;
}

export interface ShapeSectionProps {
  title: string;
  shape?: ShapeType;
  items: ShapeItem[];
  categorySlug?: string;
}

export interface HeroSliderProps {
  images: string[];
}

export interface HeaderProps {
  isScrolled: boolean;
}

export interface MainNavBarProps {
  isScrolled?: boolean;
}

export interface TopCategoriesProps {
  categories: CategoryItem[];
}

export interface CampaignProps {
  image: string;
  link: string;
  alt?: string;
}

export interface GridProps {
  columns?: number;
  gap?: number;
  children: ReactNode;
  className?: string;
}

export interface ImageCardProps {
  image: string;
  alt: string;
  link: string;
  borderRadius?: string;
}

export interface GridSectionProps {
  title: string;
  columns?: number;
  gap?: number;
  items: ExclusiveItem[];
}

export interface FeaturedGridProps {
  title: string;
  items: ExclusiveItem[];
}

export interface PremiumEyewearProps {
  /** Render only sections with homepageOrder >= this value */
  minHomepageOrder?: number;
  /** Render only sections with homepageOrder < this value */
  maxHomepageOrder?: number;
}

export interface CategoryNavItem {
  id: string;
  label: string;
  link: string;
}

export interface PremiumBrandTile {
  name: string;
  tagline: string;
  image: string;
  link: string;
}

export interface CollectionSectionCard {
  _id: string;
  title: string;
  tagline: string;
  thumbnail: string;
  link: string;
  order: number;
}

export interface CollectionSection {
  _id: string;
  name: string;
  slug: string;
  homepageOrder: number;
  cards: CollectionSectionCard[];
}

export interface CategoryNavProps {
  categories: CategoryNavItem[];
  activeCategory?: string;
}
