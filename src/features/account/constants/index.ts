import type { FooterLinkColumn } from "@/shared/types";

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
      { label: "Coupons", href: "/coupons" },
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
