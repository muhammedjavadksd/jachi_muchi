import { ROUTE_PATHS } from "./routes";
import { CUSTOMER_CARE } from "./contactInfo";

export { ROUTE_PATHS, storeLocatorWithService } from "./routes";
export {
  CUSTOMER_CARE,
  CUSTOMER_CARE_HOURS,
  CUSTOMER_CARE_FALLBACK_MESSAGE,
  CUSTOMER_CARE_CALL_LABEL,
} from "./contactInfo";

export const BRAND_LOGO_URL = "/logo.png";

export const CURRENCY_SYMBOL = "QAR ";

/**
 * Customer care number for documents (invoices).
 *
 * BUG-025: this used to be its own literal, `+91-7034-683-567`, a stale Indian
 * number that disagreed with every other surface. It is now derived from the
 * single source in `contactInfo.ts`, so a change there updates the invoice too.
 *
 * Empty string when no number is configured — callers must guard, since
 * `doc.text("")` would otherwise print a blank line on the invoice.
 */
export const SUPPORT_PHONE: string = CUSTOMER_CARE.display;

/**
 * The Qatar WhatsApp business line, used site-wide by `WhatsAppButton`,
 * `WaysToShop`, the Contact Us / Help CTAs and the MOI eye test page.
 *
 * This is a *separate channel* from {@link CUSTOMER_CARE} and is intentionally
 * not derived from it: a dedicated store landline for call traffic is a
 * different line from the WhatsApp-enabled mobile, and the two can differ per
 * environment. BUG-025 briefly aliased one to the other, which would have made
 * a landline change silently break every WhatsApp link.
 */
export const QATAR_WHATSAPP_NUMBER = "97477264007";

export const QATAR_WHATSAPP_URL = `https://wa.me/${QATAR_WHATSAPP_NUMBER}`;

/** Human-readable form of {@link QATAR_WHATSAPP_NUMBER}, used as link text. */
export const QATAR_PHONE_DISPLAY: string = CUSTOMER_CARE.display;

/**
 * `tel:` href for the customer care line. Empty string when no support number
 * is configured, so a placeholder can never be dialled — callers should check
 * `CUSTOMER_CARE.isAvailable` (or the emptiness of this string) before using it.
 */
export const QATAR_TEL_URL: string = CUSTOMER_CARE.telHref;

export const TOTAL_SLIDES = 5;

export const SCROLL_THRESHOLD = 200;

export const HEADER_SPACER_HEIGHT = 132;

export const LOGOUT_REDIRECT_PATH = "/?login=true";

export const LOGOUT_REDIRECT_DELAY_MS = 500;

/**
 * Copy for the logout confirmation dialog (BUG-006). Signing out destroys the
 * session, so the destructive action is never triggered by a single click.
 * Kept next to the other LOGOUT_* values so the whole sign-out flow has a
 * single source of truth.
 */
export const LOGOUT_CONFIRM_TITLE = "Logout";

export const LOGOUT_CONFIRM_DESCRIPTION = "Are you sure you want to logout?";

export const LOGOUT_CONFIRM_CANCEL_LABEL = "Cancel";

export const LOGOUT_CONFIRM_ACTION_LABEL = "Logout";

export const ORDER_CANCELLED_REFUND_NOTE =
  "Your refund has been initiated and will be credited to your original payment method within a few business days.";

export const HEADER_NAV_ITEMS = [
  { id: "eyeglasses", label: "Eyeglasses", link: "/search/eyeglasses" },
  { id: "screen-glasses", label: "Screen Glasses", link: "/search/screen-glasses" },
  { id: "kids-glasses", label: "Kids Glasses", link: "/search/kids-glasses" },
  // { id: "contact-lenses", label: "Contact Lenses", link: "/search/contact-lenses" },
  { id: "sunglasses", label: "Sunglasses", link: "/search/sunglasses" },
  { id: "home-eye-test", label: "Home Eye-Test", link: "/online-eye-test" },
  { id: "store-locator", label: "Store Locator", link: ROUTE_PATHS.storeLocator },
  { id: "moi-approved", label: "MOI Approved", link: "/moi-approved-eye-test-qatar" },
] as const;
