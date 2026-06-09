/**
 * Type definitions for the application
 * All interfaces and types should be defined here and imported where needed
 */

// ============================================
// DATA TYPES
// ============================================

/** Banner item from the banners API */
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
  categorySlug?: string;
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
  isScrolled?: boolean;
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

// ============================================
// AUTH TYPES
// ============================================

/** User data from API */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
}

/** API user data (from signup/verify responses) */
export interface ApiUser {
  _id?: string;
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

/** Signup request payload */
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

/** Signup API response */
export interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    email?: string;
    token?: string;
    user?: ApiUser;
  };
  user?: User;
  token?: string;
}

/** OTP verification request payload */
export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

/** OTP verification API response */
export interface OtpVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: ApiUser;
  };
  user?: User;
  token?: string;
}

/** Login request payload */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Login API response */
export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: ApiUser;
  };
}

/** User profile data */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  gender?: string;
  avatar?: string;
}

/** Fetch user profile API response */
export interface UserProfileResponse {
  success: boolean;
  message: string;
  data?: UserProfile;
}

/** Update profile request payload */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  gender?: string;
}

/** Change password request payload */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Change password API response */
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/** Address data */
export interface AddressData {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
}

/** Add/Update address request payload */
export interface SaveAddressRequest {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work" | "other";
  isDefault?: boolean;
}

/** Address list API response */
export interface AddressListResponse {
  success: boolean;
  message: string;
  data?: AddressData[];
}

/** Single address API response */
export interface AddressResponse {
  success: boolean;
  message: string;
  data?: AddressData;
}

/** Delete address API response */
export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}

// ============================================
// LENS TYPES
// ============================================

/** Lens item from API */
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

/** Cart item with lens data */
export interface CartItemData {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  lens?: {
    name: string;
    price: number;
  };
  lensPrice?: number;
  totalPrice: number;
  powerType?: string;
}

// ============================================
// WISHLIST API TYPES
// ============================================

/** Wishlist item from API */
export interface ApiWishlistItem {
  _id?: string;
  id?: string;
  productId: string;
  name: string;
  image: string;
  link: string;
  price: number;
  addedAt?: string;
}

/** Add to wishlist request payload */
export interface AddToWishlistRequest {
  productId: string;
  name: string;
  image: string;
  link: string;
  price: number;
}

/** Wishlist API response */
export interface WishlistResponse {
  success: boolean;
  message: string;
  data?: ApiWishlistItem[];
}

/** Single wishlist item response */
export interface WishlistItemResponse {
  success: boolean;
  message: string;
  data?: ApiWishlistItem;
}


export interface PowerDetails {
  leftSPH?: string;
  rightSPH?: string;
  leftCYL?: string;
  rightCYL?: string;
  isSamePower: boolean;
  hasCylindrical: boolean;
  customerName: string;
  customerPhone: string;
}

// ============================================
// STORE TYPES
// ============================================

export interface Store {
  _id?: string;
  id?: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  phone: string;
  email?: string;
  timings?: string;
  timing?: string;
  images?: string[];
  services?: string[];
  lat: number;
  lng: number;
  isActive: boolean;
  location?: {
    type: string;
    coordinates: number[];
  };
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchResult {
  suggestions: string[];
  categories: string[];
}

// ============================================
// PRODUCT DETAIL TYPES
// ============================================

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
  colors?: { name: string; hex?: string; image?: string }[];
  description?: string;
  brand?: string;
  frameType?: string;
  shape?: string;
  inStock?: boolean;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface ReviewUser {
  _id: string;
  name: string;
  email?: string;
}

export interface ReviewItem {
  _id: string;
  product: string;
  user: ReviewUser;
  rating: number;
  message: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RatingDistributionItem {
  star: number;
  count: number;
  percentage: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistributionItem[];
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  review: string;
}

export interface UpdateReviewPayload {
  rating: number;
  review: string;
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ReviewListResponse {
  success: boolean;
  data: ReviewItem[];
  summary?: ReviewSummary;
  pagination?: ReviewPagination;
}

export interface ReviewActionResponse {
  success: boolean;
  data?: ReviewItem | { canReview?: boolean };
  message?: string;
}