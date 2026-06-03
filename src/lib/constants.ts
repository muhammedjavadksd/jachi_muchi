import type { ShapeItem, CategoryItem, ProductItem, PopularEyewearItem, NearbyServiceItem, ExclusiveItem, FooterLinkColumn, CategoryNavItem, FilterGroup, ProductCardProps } from "../types";

/**
 * Brand logo URL from Lenskart CDN
 * Used in the main navigation header
 */
export const BRAND_LOGO_URL = "https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg";

/**
 * Customer support phone number
 * Displayed in the top utility header
 */
export const SUPPORT_PHONE = "1800-266-4444";

/**
 * Total number of slides in the hero carousel
 * Used to calculate slide navigation
 */
export const TOTAL_SLIDES = 3;

/**
 * Scroll threshold in pixels to trigger navbar color change
 * When user scrolls past this value, navbar changes from dark to light
 */
export const SCROLL_THRESHOLD = 200;

/**
 * Height of the top utility header spacer in pixels
 * Used to offset content below the fixed header
 * Must match: PromotionHeader (h-8 + h-16 + borders = ~100px)
 */
export const HEADER_SPACER_HEIGHT = 110;

/**
 * Utility links displayed in the top header bar
 * These are secondary navigation links for corporate and partner pages
 */
export const UTILITY_LINKS: string[] = [
  "Corporate",
  "Store Locator",
  "Singapore",
  "UAE",
  "John Jacobs",
  "Aqualens",
  "Cobrowsing",
  "Engineering Blog",
  "Partner With Us",
];

/**
 * Main navigation category links
 * Primary product categories displayed in the main navbar
 */
export const NAV_CATEGORIES: string[] = [
  "Eyeglasses",
  "Sunglasses",
  "Collections",
  "Contact",
  // "Special Power",
  "Stores",
  "Try @ Home",
];

/**
 * Eyeglass shape options for the shape selector section
 * Each shape links to a filtered product listing page
 */
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

/**
 * Sunglass shape options for the shape selector section
 * Each shape links to a filtered product listing page
 */
export const SUNGLASS_SHAPES: ShapeItem[] = [
  { label: "Aviator", image: "/category/image.png", link: "/sunglasses/aviator" },
  { label: "Wayfarer", image: "/category/image.png", link: "/sunglasses/wayfarer" },
  { label: "Round", image: "/category/image.png", link: "/sunglasses/round" },
  { label: "Rectangle", image: "/category/image.png", link: "/sunglasses/rectangle" },
  { label: "Clubmaster", image: "/category/image.png", link: "/sunglasses/clubmaster" },
  { label: "Sports", image: "/category/image.png", link: "/sunglasses/sports" },
];

/**
 * Preferred frame types for Home Try-On booking
 */
export const PREFERRED_FRAME_TYPES: string[] = [
  "Eyeglasses",
  "Sunglasses",
  "Computer Glasses",
];

/**
 * Top category items for the homepage category grid
 * Main product categories with images and optional discount badges
 */
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

/**
 * Hero slider banner images
 * Full-width promotional banners for the homepage carousel
 */
export const HERO_BANNER_IMAGES: string[] = [
  "/banner/image.png",
  "/banner/image.png",
  "/banner/image.png",
];

export const SECONDARY_BANNERS: string[] = [
  // "/campign/image.png",
  "/campign/4.png",
  "/campign/4.png",
  "/campign/4.png",
  "/campign/4.png",
  "/campign/4.png",
] as const;

/**
 * Campaign section configuration
 * Full-width promotional banner below categories
 */
export const CAMPAIGN_CONFIG = {
  image: "/campign/image.png",
  link: "/campaign",
  alt: "Campaign",
};

/**
 * Trending products for the homepage
 * Featured products with pricing and promotional tags
 */
export const TRENDING_PRODUCTS: ProductItem[] = [
  { name: "Vincent Chase", price: "₹1,299", tag: "New" },
  { name: "Lenskart Air", price: "₹2,499", tag: "Trending" },
  { name: "John Jacobs", price: "₹3,499", tag: "Premium" },
  { name: "Vincent Chase", price: "₹1,799", tag: "Bestseller" },
  { name: "Lenskart Air Flex", price: "₹2,999", tag: "New" },
  { name: "John Jacobs Titan", price: "₹4,299", tag: "Premium" },
];

/**
 * New sunglasses arrivals
 * Recently added sunglass products
 */
export const NEW_SUNGLASSES: ProductItem[] = [
  { name: "Polarized Aviator", price: "₹1,999" },
  { name: "Classic Wayfarer", price: "₹2,299" },
  { name: "Sport Shield", price: "₹2,799" },
  { name: "Retro Round", price: "₹1,799" },
];

/**
 * Bestselling eyeglasses
 * Top-selling eyeglass products
 */
export const BESTSELLERS: ProductItem[] = [
  { name: "Titanium Frame", price: "₹3,999" },
  { name: "Air Flex Ultra", price: "₹2,499" },
  { name: "Zero Power Blue", price: "₹1,299" },
  { name: "Memory Metal", price: "₹2,999" },
];

/**
 * Partner brand names
 * Featured eyewear brands available on the platform
 */
export const BRANDS: string[] = [
  "Ray-Ban",
  "Oakley",
  "Vogue",
  "Fossil",
  "Carrera",
  "Tommy Hilfiger",
];

/**
 * Popular eyewear categories with descriptions
 * Used in the popular eyewear section
 */
export const POPULAR_EYEWEAR: PopularEyewearItem[] = [
  { name: "Computer Glasses", desc: "Blue light protection" },
  { name: "Reading Glasses", desc: "Clear vision" },
  { name: "Progressive Lenses", desc: "Multi-focal" },
  { name: "Sunglasses", desc: "UV protection" },
];

/**
 * Nearby stores and services configuration
 * Service cards displayed in the NearbyServices section
 * Each card shows a full-width image with an arrow button
 */
export const NEARBY_SERVICES: NearbyServiceItem[] = [
  {
    title: "Visit Your Nearest Store",
    image: "/near/near_store.png",
    link: "/stores",
  },
  {
    title: "Experience Our Home Try-On",
    image: "/near/try_on.png",
    link: "/home-try-on",
  },
  {
    title: "Order Now on WhatsApp",
    image: "/near/order_whatsapp.png",
    link: "https://wa.me/917034683567?text=Hi%20Lenskart%2C%20I%20am%20on%20Desktop.%20Can%20you%20guide%20me%3F",
  },
{
  title: "Connect with your Experts",
  image: "/near/connect_experts.png",
  link: "tel:7034683567",
}
];

/**
 * Exclusive items for the Exclusively at Lenskart section
 * 3x2 grid of exclusive product categories with images
 */
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
    image: "https://static5.lenskart.com/media/uploads/Home-Eye-Test-5X6desktop-18-12-AV.png",
    link: "/home-try-on",
  },
  {
    title: "Take an Online Eye Test",
    image: "/free/Online-Eye-Test.png",
    link: "/online-eye-test",
  },
];

/**
 * Premium Eyewear brands for the FeaturedGrid section
 * First item is the large featured card, rest are in 2x2 grid
 */
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

/**
 * Footer navigation links organized by category
 * Used in the Footer component
 */
export const FOOTER_LINKS: FooterLinkColumn[] = [
  {
    title: "Services",
    links: [
      { label: "Store Locator", href: "/store-locator" },
      { label: "Buying Guide", href: "/buying-guide" },
      { label: "Frame Size", href: "/frame-size" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Who We Are", href: "/about" },
      { label: "We Are Hiring", href: "/careers" },
      { label: "Refer And Earn", href: "/refer" },
      { label: "Lenskart Coupons", href: "/coupons" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Support", href: "/support" },
      { label: "FAQ's", href: "/faq" },
      { label: "Grievance Redressal", href: "/grievance" },
      { label: "Cardemi", href: "/cardemi" },
    ],
  },
];

// ============================================
// SEARCH PAGE CONSTANTS
// ============================================

/**
 * Search page category navigation items
 * Secondary navigation below main header
 */
export const SEARCH_CATEGORIES: CategoryNavItem[] = [
  { id: "eyeglasses", label: "EYEGLASSES", link: "/search/eyeglasses" },
  { id: "screen-glasses", label: "SCREEN GLASSES", link: "/search/screen-glasses" },
  { id: "kids-glasses", label: "KIDS GLASSES", link: "/search/kids-glasses" },
  { id: "contact-lenses", label: "CONTACT LENSES", link: "/search/contact-lenses" },
  { id: "sunglasses", label: "SUNGLASSES", link: "/search/sunglasses" },
  { id: "home-eye-test", label: "HOME EYE-TEST", link: "/home-eye-test" },
  { id: "store-locator", label: "STORE LOCATOR", link: "/store-locator" },
  { id: "sale", label: "SALE", link: "/sale" },
];

/**
 * Search page filter configuration
 * Filter groups for the sidebar
 */
export const SEARCH_FILTERS: FilterGroup[] = [
  {
    id: "frame-type",
    title: "Frame Type",
    type: "shape",
    collapsible: false,
    options: [
      { id: "full-rim", label: "Full Rim", icon: "▢" },
      { id: "rimless", label: "Rimless", icon: "○" },
      { id: "half-rim", label: "Half Rim", icon: "◠" },
    ],
  },
  {
    id: "frame-shape",
    title: "Frame Shape",
    type: "shape",
    collapsible: false,
    options: [
      { id: "square", label: "Square", icon: "▢" },
      { id: "rectangle", label: "Rectangle", icon: "▭" },
      { id: "cat-eye", label: "Cat Eye", icon: "◇" },
      { id: "round", label: "Round", icon: "○" },
      { id: "geometric", label: "Geometric", icon: "⬡" },
      { id: "aviator", label: "Aviator", icon: "◇" },
      { id: "clubmaster", label: "Clubmaster", icon: "▢" },
      { id: "oval", label: "Oval", icon: "⬭" },
    ],
  },
  {
    id: "frame-color",
    title: "Frame Color",
    type: "checkbox",
    collapsible: false,
    options: [
      { id: "black", label: "Black" },
      { id: "transparent", label: "Transparent" },
      { id: "blue", label: "Blue" },
      { id: "gunmetal", label: "Gunmetal" },
      { id: "gold", label: "Gold" },
      { id: "grey", label: "Grey" },
      { id: "silver", label: "Silver" },
      { id: "brown", label: "Brown" },
      { id: "green", label: "Green" },
      { id: "purple", label: "Purple" },
      { id: "pink", label: "Pink" },
      { id: "rose-gold", label: "Rose Gold" },
    ],
  },
  {
    id: "brands",
    title: "Brands",
    type: "checkbox",
    options: [],
  },
];

/**
 * Sample products for the search page
 * Product listing data - each product has 2 images for hover effect
 */
export const SAMPLE_PRODUCTS: ProductCardProps[] = [
  {
    images: ["/category/image.png", "/banner/image.png"],
    name: "Lenskart Air",
    description: "Size: Medium • Shades of Steel",
    price: 1600,
    originalPrice: 1990,
    discount: 26,
    rating: 4.8,
    reviews: 11349,
    colors: [
      { colorCode: "#000000", image: "/category/image.png" },
      { colorCode: "#c0c0c0", image: "/banner/image.png" },
      { colorCode: "#8b4513", image: "/category/image.png" },
      { colorCode: "#1e40af", image: "/banner/image.png" },
    ],
    link: "/product/1",
  },
  {
    images: ["/category/image.png", "/banner/image.png"],
    name: "John Jacobs",
    description: "Size: Wide",
    price: 3100,
    originalPrice: 3700,
    discount: 21,
    rating: 4.9,
    reviews: 3675,
    colors: [
      { colorCode: "#000000", image: "/category/image.png" },
      { colorCode: "#8b4513", image: "/banner/image.png" },
    ],
    link: "/product/2",
  },
  {
    images: ["/category/image.png", "/banner/image.png"],
    name: "Vincent Chase",
    description: "Size: Narrow",
    price: 1600,
    originalPrice: 1900,
    discount: 26,
    rating: 4.9,
    reviews: 656,
    colors: [
      { colorCode: "#ffc0cb", image: "/category/image.png" },
      { colorCode: "#ffd700", image: "/banner/image.png" },
    ],
    link: "/product/3",
  },
  {
    images: ["/category/image.png", "/banner/image.png"],
    name: "John Jacobs",
    description: "Size: Medium • John Jacobs",
    price: 3100,
    originalPrice: 3700,
    discount: 21,
    rating: 4.9,
    reviews: 921,
    colors: [
      { colorCode: "#000000", image: "/category/image.png" },
      { colorCode: "#8b4513", image: "/banner/image.png" },
      { colorCode: "#c0c0c0", image: "/category/image.png" },
    ],
    link: "/product/4",
  },
  {
    images: ["/category/image.png", "/banner/image.png"],
    name: "Lenskart Air",
    description: "Size: Extra Wide",
    price: 2400,
    originalPrice: 2900,
    discount: 17,
    rating: 4.8,
    reviews: 726,
    colors: [
      { colorCode: "#000000", image: "/category/image.png" },
      { colorCode: "#1e40af", image: "/banner/image.png" },
    ],
    link: "/product/5",
  },
  {
    images: ["/category/image.png", "/banner/image.png"],
    name: "John Jacobs",
    description: "Size: Narrow",
    price: 3100,
    originalPrice: 3900,
    discount: 21,
    rating: 4.9,
    reviews: 2999,
    colors: [
      { colorCode: "#f5f5f5", image: "/category/image.png" },
      { colorCode: "#000000", image: "/banner/image.png" },
    ],
    link: "/product/6",
  },
  {
    images: ["/category/image.png", "/banner/image.png"],
    name: "Vincent Chase",
    description: "Size: Medium • Shades of Steel",
    price: 1400,
    originalPrice: 1890,
    discount: 26,
    rating: 4.8,
    reviews: 2059,
    colors: [
      { colorCode: "#000000", image: "/category/image.png" },
      { colorCode: "#8b4513", image: "/banner/image.png" },
      { colorCode: "#c0c0c0", image: "/category/image.png" },
      { colorCode: "#1e40af", image: "/banner/image.png" },
    ],
    link: "/product/7",
  },
  {
    images: ["/category/image.png", "/banner/image.png"],
    name: "John Jacobs",
    description: "Size: Extra Wide",
    price: 4100,
    originalPrice: 4900,
    discount: 16,
    rating: 4.8,
    reviews: 13,
    colors: [
      { colorCode: "#000000", image: "/category/image.png" },
      { colorCode: "#8b4513", image: "/banner/image.png" },
    ],
    link: "/product/8",
  },
  {
    images: ["/category/image.png", "/banner/image.png"],
    name: "Lenskart Air",
    description: "Size: Premium • AIR FUSION",
    price: 1400,
    originalPrice: 1890,
    discount: 26,
    rating: 4.8,
    reviews: 6890,
    colors: [
      { colorCode: "#f5f5f5", image: "/category/image.png" },
      { colorCode: "#ffc0cb", image: "/banner/image.png" },
      { colorCode: "#87ceeb", image: "/category/image.png" },
    ],
    link: "/product/9",
  },
];
