import type { LensSortOption } from "@/features/lens/types";

/**
 * Sort choices shown on the lens listing. Values reuse the storefront's
 * existing sort state (`best-sellers`, `price-low`, `price-high`, `newest`)
 * so the frame listing behaviour and state stay untouched. The lens endpoint
 * has no sort parameter, so ordering is applied to the received collection.
 */
export const LENS_SORT_OPTIONS: readonly LensSortOption[] = [
  { value: "best-sellers", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

/** Category slug that lists every lens product. */
export const LENSES_CATEGORY_SLUG = "lenses";

/** Title and breadcrumb label for the all-lenses listing. */
export const LENSES_LISTING_TITLE = "Lenses";

/** Canonical URL for the all-lenses listing. */
export const LENSES_LISTING_PATH = "/search/lenses";

/**
 * Filter groups that only make sense for frames. They are removed from the
 * filter sidebar when the storefront is showing lenses.
 */
export const LENS_HIDDEN_FILTER_IDS: readonly string[] = [
  "frame-shape",
  "frame-type",
];

/** Breadcrumb trail shown above the lens listing title. */
export const LENS_BREADCRUMB_LINKS: readonly { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Lenses", to: LENSES_LISTING_PATH },
];

/**
 * Neutral inline placeholder used when a lens has no image or the image
 * fails to load. Kept inline so the grid never waits on a third-party host.
 */
export const LENS_FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f6f6f6'/%3E%3Cg fill='none' stroke='%23cfcfcf' stroke-width='3'%3E%3Ccircle cx='70' cy='100' r='26'/%3E%3Ccircle cx='130' cy='100' r='26'/%3E%3Cpath d='M96 100h8'/%3E%3C/g%3E%3C/svg%3E";

/** Number of placeholder cards rendered while the lens request is in flight. */
export const LENS_GRID_SKELETON_COUNT = 8;

/** Lens detail route prefix. Card links append the lens id. */
export const LENS_DETAIL_PATH = "/lens";

/** Maximum number of same-category lenses shown in the detail carousel. */
export const LENS_SIMILAR_LIMIT = 12;

/**
 * UI limits for the prescription dropdowns. The administration form allows
 * wider ranges than a normal prescription, so options stop at these values
 * while every generated step remains a real quarter-diopter value.
 */
export const LENS_POWER_UI_LIMITS = {
  sph: 20,
  cyl: 6,
  add: 3.5,
  step: 0.25,
} as const;

/** Copy and labels shared by the lens detail page and its components. */
export const LENS_DETAIL_COPY = {
  delivery: "Delivery",
  detailsTitle: "Product Details",
  powerTitle: "Power",
  rightEye: "RIGHT (OD)",
  leftEye: "LEFT (OS)",
  sph: "SPH",
  cyl: "CYL",
  add: "ADD",
  selectEye: "Select at least one eye to enter its power.",
  selectOption: "Select",
  powerStepNote: "Options use 0.25 D steps within this lens's available range.",
  powerTotalExceeded: "SPH + CYL together can't exceed",
  powerIncomplete: "Select power for every checked eye before adding to cart.",
  similarTitle: "Similar Products",
  addToCart: "Add To Cart",
  addToCartSuccess: "Lens added to your cart.",
  addToCartError: "Could not add this lens to your cart. Please try again.",
  lensUnavailable: "This lens cannot be added to your cart right now.",
  errorTitle: "We couldn't load this lens",
  errorMessage: "Please check your connection and try again.",
  retry: "Try again",
  fallbackDelivery: "Delivery information unavailable",
} as const;
