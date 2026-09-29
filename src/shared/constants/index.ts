export const BRAND_LOGO_URL = "/logo.png";

export const CURRENCY_SYMBOL = "QAR ";

export const SUPPORT_PHONE = "+91-7034-683-567";

/**
 * Real Qatar WhatsApp number, already used site-wide by `WhatsAppButton` and
 * `WaysToShop`. Extracted here so call/WhatsApp CTAs can never drift from the
 * number the rest of the storefront advertises.
 */
export const QATAR_WHATSAPP_NUMBER = "97477264007";

export const QATAR_WHATSAPP_URL = `https://wa.me/${QATAR_WHATSAPP_NUMBER}`;

/** Human-readable form of {@link QATAR_WHATSAPP_NUMBER}, used as link text. */
export const QATAR_PHONE_DISPLAY = "+974 7726 4007";

/** `tel:` href. TODO_CONFIRM: confirm a dedicated store landline for the Qatar branches. */
export const QATAR_TEL_URL = `tel:+${QATAR_WHATSAPP_NUMBER}`;

export const TOTAL_SLIDES = 5;

export const SCROLL_THRESHOLD = 200;

export const HEADER_SPACER_HEIGHT = 132;

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
  { id: "moi-approved", label: "MOI Approved", link: "/moi-approved-eye-test-qatar" },
] as const;
