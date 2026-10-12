import type { FooterLinkColumn } from "@/shared/types";
import { ROUTE_PATHS } from "@/shared/constants/routes";

export const UTILITY_LINKS: string[] = [];

export const NAV_CATEGORIES: string[] = [
  "Eyeglasses",
  "Sunglasses",
  "Collections",
  "Contact",
  "Stores",
  "Try @ Home",
];

export const FOOTER_LINKS: FooterLinkColumn[] = [
  {
    title: "Services",
    links: [
      { label: "Store Locator", href: ROUTE_PATHS.storeLocator },
      { label: "MOI Approved Eye Test", href: "/moi-approved-eye-test-qatar" },
      // BUG-028 / BUG-029: "Frame Size" and "Buying Guide" were both bare
      // literals (/frame-size, /buying-guide) with no matching route, so each
      // click rendered the 404 page. Both now read ROUTE_PATHS, which the route
      // table in app/routes/index.tsx also uses.
      { label: "Buying Guide", href: ROUTE_PATHS.buyingGuide },
      { label: "Frame Size", href: ROUTE_PATHS.frameSizeGuide },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Who We Are", href: "/about" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Support", href: "/support" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    // BUG-023: these five were bare string literals. `/disclaimer` in
    // particular had no matching route, so it rendered the 404 page. All of
    // them now read `ROUTE_PATHS`, which `app/routes/index.tsx` also uses, so a
    // link can no longer point at a path that was never registered.
    links: [
      { label: "Terms & Conditions", href: ROUTE_PATHS.terms },
      { label: "Privacy Policy", href: ROUTE_PATHS.privacy },
      { label: "Disclaimer", href: ROUTE_PATHS.disclaimer },
      { label: "Return Policy", href: ROUTE_PATHS.refundPolicy },
      { label: "Shipping Policy", href: ROUTE_PATHS.shippingPolicy },
    ],
  },
];
