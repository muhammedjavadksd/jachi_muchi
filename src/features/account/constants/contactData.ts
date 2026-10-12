import { ROUTE_PATHS } from "@/shared/constants/routes";
import { QATAR_WHATSAPP_URL } from "@/shared/constants";
import { CUSTOMER_CARE } from "@/shared/constants/contactInfo";

// BUG-025: the local `contactInfo = { phone: "0000-000-000", email:
// "care@example.com" }` object was deleted rather than re-pointed. The Contact
// Us page read its number from it, so it rendered a placeholder that dialled
// nothing. The single source now lives in `shared/constants/contactInfo.ts`
// (environment-overridable) and every surface reads that directly.

export const supportCards = [
{
    title: "About our products & services",
    description: "Questions about frames, lenses, orders, or store services.",
  },
  {
    title: "Returns & exchanges",
    description: "Need to adjust, exchange, or return an item you purchased.",
  },
  {
    title: "Account & orders",
    description: "Help with your account, payments, or order status.",
  },
];


 export const serviceLinks = [
  { label: "Warranty & FAQs", href: "/faq" },
  // BUG-025: was built from the "0000-000-000" placeholder, producing a dead
  // `https://wa.me/0000000`. Now uses the shared WhatsApp channel, so this CTA
  // reaches the same inbox as the floating button and the Help page.
  { label: "Chat with us on WhatsApp", href: QATAR_WHATSAPP_URL },
  { label: "Write to customer care", href: `mailto:${CUSTOMER_CARE.email}` },
  // BUG-024: was `/search?type=stores`, the Products listing route with a
  // `type` param `SearchPage` does not read — so "Locate a nearby store" opened
  // the products grid. Now uses the shared store-locator path.
  { label: "Locate a nearby store", href: ROUTE_PATHS.storeLocator },
];
