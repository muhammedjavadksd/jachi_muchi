import type { ShapeItem, CategoryItem, ProductItem, NearbyServiceItem, ExclusiveItem } from "@/features/home/types";
import type { PopularEyewearItem } from "@/shared/types";

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
    link: "/stores",
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
    link: "/stores?service=free-eye-testing",
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
