/**
 * Type definitions for the application
 * All interfaces and types should be defined here and imported where needed
 */

// ============================================
// DATA TYPES
// ============================================

/** Shape item used in ShapeSection component for displaying eyewear shapes */
export interface ShapeItem {
  label: string;
  image: string;
  link?: string;
}

/** Category item used in TopCategories section */
export interface CategoryItem {
  name: string;
  label: string;
  image: string;
  link: string;
  badge?: string;
}

/** Product item used in trending and bestseller sections */
export interface ProductItem {
  name: string;
  price: string;
  tag?: string;
}

/** Brand item used in brands section */
export interface BrandItem {
  name: string;
  logo?: string;
}

/** Popular eyewear item with description */
export interface PopularEyewearItem {
  name: string;
  desc: string;
}

/** Shape type for ShapeSection component - determines container shape */
export type ShapeType = "circle" | "box";

/** Service item used in NearbyServices section */
export interface NearbyServiceItem {
  title: string;
  image: string;
  link: string;
}

/** Exclusive item used in ExclusiveSection */
export interface ExclusiveItem {
  title: string;
  image: string;
  link: string;
}

// ============================================
// COMPONENT PROPS
// ============================================

/** Props for Container component - layout wrapper with consistent padding */
export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/** Props for ShapeSection component - displays eyewear shape options */
export interface ShapeSectionProps {
  title: string;
  shape?: ShapeType;
  items: ShapeItem[];
}

/** Props for HeroSlider component - homepage banner carousel */
export interface HeroSliderProps {
  images: string[];
}

/** Props for Header component - fixed navigation header */
export interface HeaderProps {
  isScrolled: boolean;
}

/** Props for MainNavBar component - main navigation with scroll state */
export interface MainNavBarProps {
  isScrolled: boolean;
  mobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
  onMobileMenuClose?: () => void;
  onSearchClick?: () => void;
}

/** Props for TopCategories component - category grid section */
export interface TopCategoriesProps {
  categories: CategoryItem[];
}

/** Props for Campaign component - full-width promotional banner */
export interface CampaignProps {
  image: string;
  link: string;
  alt?: string;
}

/** Props for Grid component - reusable grid layout */
export interface GridProps {
  /** Number of columns (1-6) */
  columns?: number;
  /** Gap between items (2-8) */
  gap?: number;
  /** Grid children elements */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/** Props for ImageCard component - clickable image card */
export interface ImageCardProps {
  image: string;
  alt: string;
  link: string;
  borderRadius?: string;
}

/** Props for GridSection component - reusable grid section */
export interface GridSectionProps {
  /** Section title */
  title: string;
  /** Number of columns (default: 3) */
  columns?: number;
  /** Gap between items (default: 5) */
  gap?: number;
  /** Array of items to display */
  items: ExclusiveItem[];
}

/** Props for FeaturedGrid component - large card + 2x2 grid layout */
export interface FeaturedGridProps {
  /** Section title */
  title: string;
  /** Array of items (first item is featured, next 4 in grid) */
  items: ExclusiveItem[];
}

/** Footer link item */
export interface FooterLink {
  label: string;
  href: string;
}

/** Footer link column with title and links */
export interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

// ============================================
// PRODUCT & SEARCH TYPES
// ============================================

/** Color variant with color code and associated image */
export interface ColorVariant {
  colorCode: string;
  image: string;
}

/** Wishlist item - minimal product data for canvas display */
export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  link: string;
  price: number;
}

/** Product card data for product listings */
export interface ProductCardProps {
  /** Array of images - first is default, second shows on hover */
  images: string[];
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  /** Color variants - clicking changes displayed image */
  colors?: ColorVariant[];
  link: string;
}

/** Filter option for filter sidebar */
export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  icon?: string;
  color?: string;
}

/** Filter group containing multiple options */
export interface FilterGroup {
  id: string;
  title: string;
  type: "checkbox" | "shape" | "color";
  options: FilterOption[];
  /** If false, the section is always open and not collapsible */
  collapsible?: boolean;
}

/** Props for FilterSidebar component */
export interface FilterSidebarProps {
  filters: FilterGroup[];
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

/** Category item for navigation */
export interface CategoryNavItem {
  id: string;
  label: string;
  link: string;
}

/** Props for CategoryNav component */
export interface CategoryNavProps {
  categories: CategoryNavItem[];
  activeCategory?: string;
}

// ============================================
// PRODUCT DETAIL TYPES
// ============================================

/** Product specification item */
export interface ProductSpec {
  label: string;
  value: string;
}

/** Product detail data for product detail page */
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
  /** All product images for gallery */
  images: string[];
  /** Color variants with images */
  colors: ColorVariant[];
  /** Product specifications */
  specs: ProductSpec[];
  /** Product features list */
  features: string[];
  /** Additional description text */
  longDescription?: string;
  /** Offer badge text */
  offerBadge?: string;
}

// ============================================
// ICON PROPS
// ============================================

/** Props for SVG icon components */
export interface IconProps {
  className?: string;
  width?: number;
  height?: number;
  stroke?: string;
}

// ============================================
// HOOK RETURN TYPES
// ============================================

/** Return type for useSlider hook - slider state and navigation controls */
export interface UseSliderReturn {
  /** Current active slide index (0-based) */
  currentSlide: number;
  /** Navigate to next slide (wraps to first slide at end) */
  nextSlide: () => void;
  /** Navigate to previous slide (wraps to last slide at beginning) */
  prevSlide: () => void;
  /** Navigate to specific slide by index */
  goToSlide: (index: number) => void;
}
