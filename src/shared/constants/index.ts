export const BRAND_LOGO_URL = "/logo.png";

export const CURRENCY_SYMBOL = "QAR ";

export const SUPPORT_PHONE = "+91-7034-683-567";

export const TOTAL_SLIDES = 5;

export const SCROLL_THRESHOLD = 200;

export const HEADER_SPACER_HEIGHT = 144;

export const LOGOUT_REDIRECT_PATH = "/?login=true";

export const LOGOUT_REDIRECT_DELAY_MS = 500;

export const ORDER_CANCELLED_REFUND_NOTE =
  "Your refund has been initiated and will be credited to your original payment method within a few business days.";

export const HEADER_NAV_ITEMS = [
  { id: "eyeglasses", label: "Eyeglasses", link: "/search/eyeglasses" },
  { id: "screen-glasses", label: "Screen Glasses", link: "/search/screen-glasses" },
  { id: "kids-glasses", label: "Kids Glasses", link: "/search/kids-glasses" },
  // { id: "contact-lenses", label: "Contact Lenses", link: "/search/contact-lenses" },
  { id: "sunglasses", label: "Sunglasses", link: "/search/sunglasses" },
  { id: "home-eye-test", label: "Home Eye-Test", link: "/online-eye-test" },
  { id: "store-locator", label: "Store Locator", link: "/stores" },
] as const;
