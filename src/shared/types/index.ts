import type { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export interface HeaderProps {
  className?: string;
  isScrolled?: boolean;
}

export interface MainNavBarProps {
  className?: string;
  isScrolled?: boolean;
}

export interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: number;
  columns?: number;
  gap?: number;
}

export interface ImageCardProps {
  src?: string;
  image?: string;
  alt?: string;
  className?: string;
  link?: string;
  borderRadius?: string;
}

export interface ColorVariant {
  colorCode: string;
  image: string;
}

export interface IconProps {
  className?: string;
  width?: number;
  height?: number;
  stroke?: string;
}

export interface UseSliderReturn {
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
}

export interface SearchResult {
  suggestions: string[];
  categories: string[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

export interface PopularEyewearItem {
  name: string;
  desc: string;
}
