import type { FooterLinkColumn } from "@/shared/types";

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
      { label: "Store Locator", href: "/stores" },
      { label: "Buying Guide", href: "/buying-guide" },
      { label: "Frame Size", href: "/frame-size" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
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
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Grievance Redressal", href: "/grievance" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Return Policy", href: "/refund-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Cookies Settings", href: "/cookies" },
    ],
  },
];
