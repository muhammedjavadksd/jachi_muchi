import type { ShapeItem, CategoryItem, ProductItem, NearbyServiceItem, ExclusiveItem } from "@/features/home/types";
import type { PopularEyewearItem } from "@/shared/types";
import { ROUTE_PATHS, storeLocatorWithService } from "@/shared/constants/routes";

/**
 * Shared default `object-position` for every homepage image card (Ways to Shop,
 * "Exclusively at Jachi & Muchi", and the brand grid). Model photos keep the
 * head near the top of the frame, so the crop is biased to the upper area
 * instead of the browser default (center) which clips heads. 15% keeps the
 * head, forehead and glasses in frame without over-cropping. Any single card
 * can override this via its own `imagePosition` value.
 */
export const DEFAULT_CARD_IMAGE_POSITION = "50% 15%";

/**
 * Per-card focal overrides for the homepage collection grids, keyed by the
 * thumbnail file name. Needed because the collection-sections API currently
 * does not expose a per-card `imagePosition`, yet some source photos are
 * framed very differently (e.g. portrait shots whose subject sits low). Value
 * format matches CSS `object-position`: "<x>% <y>%". Entries can be deleted
 * once the backend/admin returns a real `imagePosition` for each card.
 */
export const CARD_IMAGE_POSITION_OVERRIDES: Record<string, string> = {
  "1787403474692-WhatsApp-Image-2026-08-08-at-10.08.32-PM.webp": "50% 80%",
};

/**
 * Resolves the `object-position` for a card image, preferring an explicit
 * API/admin value, then the local per-file override map, then the shared
 * default. Only the file name (query string and directories stripped) is used
 * for the override lookup so it stays stable regardless of API origin.
 */
export function resolveCardImagePosition(
  image?: string | null,
  apiValue?: string
): string {
  if (apiValue) return apiValue;
  if (image) {
    const fileName = image.split("?")[0].split("/").pop();
    if (fileName && CARD_IMAGE_POSITION_OVERRIDES[fileName]) {
      return CARD_IMAGE_POSITION_OVERRIDES[fileName];
    }
  }
  return DEFAULT_CARD_IMAGE_POSITION;
}

export const EYEGLASS_SHAPES: ShapeItem[] = [
  { label: "Rectangle", image: "/category/image.png", link: "/eyeglasses/rectangle" },
  { label: "Cateye", image: "/category/image.png", link: "/eyeglasses/cateye" },
  { label: "Aviator", image: "/category/image.png", link: "/eyeglasses/aviator" },
  { label: "Geometric", image: "/category/image.png", link: "/eyeglasses/geometric" },
  { label: "Round", image: "/category/image.png", link: "/eyeglasses/round" },
  { label: "Clubmaster", image: "/category/image.png", link: "/eyeglasses/clubmaster" },
  { label: "Square", image: "/category/image.png", link: "/eyeglasses/square" },
  { label: "Square", image: "/category/image.png", link: "/eyeglasses/square" },
  { label: "Square", image: "/category/image.png", link: "/eyeglasses/square" },
  { label: "Square", image: "/category/image.png", link: "/eyeglasses/square" },
];

export const SUNGLASS_SHAPES: ShapeItem[] = [
  { label: "Aviator", image: "/category/image.png", link: "/sunglasses/aviator" },
  { label: "Wayfarer", image: "/category/image.png", link: "/sunglasses/wayfarer" },
  { label: "Round", image: "/category/image.png", link: "/sunglasses/round" },
  { label: "Rectangle", image: "/category/image.png", link: "/sunglasses/rectangle" },
  { label: "Clubmaster", image: "/category/image.png", link: "/sunglasses/clubmaster" },
  { label: "Sports", image: "/category/image.png", link: "/sunglasses/sports" },
];

export const TOP_CATEGORIES: CategoryItem[] = [
  { name: "Eyeglasses", label: "Eyeglasses", image: "/category/image.png", link: "/category/eyeglasses" },
  { name: "Sunglasses", label: "Sunglasses", image: "/category/image.png", link: "/category/sunglasses" },
  { name: "Special Power", label: "Special Power", image: "/category/image.png", link: "/category/special-power" },
  { name: "Contact Lenses", label: "Contact Lenses", image: "/category/image.png", link: "/category/contact-lenses" },
  { name: "Kids Glasses", label: "Kids Glasses", image: "/category/image.png", link: "/category/kids-glasses" },
  { name: "Kids Glasses", label: "Kids Glasses", image: "/category/image.png", link: "/category/kids-glasses" },
  { name: "Sale", label: "Sale", image: "/category/image.png", link: "/category/sale", badge: "60% OFF" },
  { name: "Sale", label: "Sale", image: "/category/image.png", link: "/category/sale", badge: "60% OFF" },
];

export const HERO_BANNER_IMAGES: string[] = [
  "/banner/image.png",
  "/banner/image.png",
  "/banner/image.png",
];

export const SECONDARY_BANNERS: string[] = [
  "/campign/4.png",
  "/campign/4.png",
  "/campign/4.png",
  "/campign/4.png",
  "/campign/4.png",
] as const;

export const CAMPAIGN_CONFIG = {
  image: "/campign/image.png",
  link: "/campaign",
  alt: "Campaign",
};

export const TRENDING_PRODUCTS: ProductItem[] = [
  { name: "Vincent Chase", price: "QAR 1,299", tag: "New" },
  { name: "Jachi&Muchi Air", price: "QAR 2,499", tag: "Trending" },
  { name: "John Jacobs", price: "QAR 3,499", tag: "Premium" },
  { name: "Vincent Chase", price: "QAR 1,799", tag: "Bestseller" },
  { name: "Jachi&Muchi Air Flex", price: "QAR 2,999", tag: "New" },
  { name: "John Jacobs Titan", price: "QAR 4,299", tag: "Premium" },
];

export const NEW_SUNGLASSES: ProductItem[] = [
  { name: "Polarized Aviator", price: "QAR 1,999" },
  { name: "Classic Wayfarer", price: "QAR 2,299" },
  { name: "Sport Shield", price: "QAR 2,799" },
  { name: "Retro Round", price: "QAR 1,799" },
];

export const BESTSELLERS: ProductItem[] = [
  { name: "Titanium Frame", price: "QAR 3,999" },
  { name: "Air Flex Ultra", price: "QAR 2,499" },
  { name: "Zero Power Blue", price: "QAR 1,299" },
  { name: "Memory Metal", price: "QAR 2,999" },
];

export const BRANDS: string[] = [
  "Ray-Ban",
  "Oakley",
  "Vogue",
  "Fossil",
  "Carrera",
  "Tommy Hilfiger",
];

export const POPULAR_EYEWEAR: PopularEyewearItem[] = [
  { name: "Computer Glasses", desc: "Blue light protection" },
  { name: "Reading Glasses", desc: "Clear vision" },
  { name: "Progressive Lenses", desc: "Multi-focal" },
  { name: "Sunglasses", desc: "UV protection" },
];

export const NEARBY_SERVICES_ORDER_SPLIT = 2;

export const NEARBY_SERVICES: NearbyServiceItem[] = [
  {
    title: "Visit Your Nearest Store",
    image: "/near/near---store.png",
    link: ROUTE_PATHS.storeLocator,
  },
  {
    title: "Experience Our Home Try-On",
    image: "/near/try---on.png",
    link: "/home-try-on",
  },
  {
    title: "Order Now on WhatsApp",
    image: "/near/order--whatsapp.png",
    link: "https://wa.me/917034683567?text=Hi%20Jachi%26Muchi%2C%20I%20am%20on%20Desktop.%20Can%20you%20guide%20me%3F",
  },
{
  title: "Connect with your Experts",
  image: "/near/connect--experts.png",
  link: "tel:7034683567",
}
];

export const EXCLUSIVE_ITEMS: ExclusiveItem[] = [
  {
    title: "Bestsellers",
    image: "/brands/image.png",
    link: "/exclusive/bestsellers",
  },
  {
    title: "Bestsellers",
    image: "/brands/image.png",
    link: "/exclusive/bestsellers",
  },
  {
    title: "Bestsellers",
    image: "/brands/image.png",
    link: "/exclusive/bestsellers",
  },
  {
    title: "Bestsellers",
    image: "/brands/image.png",
    link: "/exclusive/bestsellers",
  },
  {
    title: "Bestsellers",
    image: "/brands/image.png",
    link: "/exclusive/bestsellers",
  },
  {
    title: "Bestsellers",
    image: "/brands/image.png",
    link: "/exclusive/bestsellers",
  },
];

export const FREE_CHECKUP: ExclusiveItem[] = [
  {
    title: "Visit Your Nearest Store",
    image: "/free/image.png",
    link: storeLocatorWithService("free-eye-testing"),
  },
  {
    title: "Schedule Eye Test at Home",
    image: "/free/image2.png",
    link: "/home-try-on",
  },
  {
    title: "Take an Online Eye Test",
    image: "/free/Online-Eye-Test1.png",
    link: "/online-eye-test",
  },
];

export const BE_MORE_BANNER = {
  image: "/bemore.png",
  alt: "Jachi & Muchi - Eyewear Beyond Expectation",
  eyebrow: "Jachi & Muchi",
  tagline: "Discover eyewear crafted for every story",
};

export const PREMIUM_EYEWEAR: ExclusiveItem[] = [
  {
    title: "Meller - Made in Spain",
    image: "/campign/premium.png",
    link: "/brands/meller",
  },
  {
    title: "John Jacobs - Made in India",
    image: "/campign/premium.png",
    link: "/brands/john-jacobs",
  },
  {
    title: "Owndays - Made in Japan",
    image: "/campign/premium.png",
    link: "/brands/owndays",
  },
  {
    title: "Le Petit Lunetier - Made in Paris",
    image: "/campign/premium.png",
    link: "/brands/le-petit-lunetier",
  },
  {
    title: "Fossil - Made in China",
    image: "/campign/premium.png",
    link: "/brands/fossil",
  },
];
