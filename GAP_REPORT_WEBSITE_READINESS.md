# Website Readiness – Gap Report  
**Project:** Jachi Muchi (Lenskart-style eyewear)  
**Comparison baseline:** Lenskart website  
**Purpose:** Identify missing features, modules, and pages to make the site full ready.  
**Date:** February 2025  

---

## 1. Executive Summary

The current codebase has a **solid UI shell**: homepage, search/listing, product detail, cart, checkout (partial), account area, policies, FAQ, contact, about, and support. Many flows are **UI-only** with no backend, no real data, and several navigation links point to **non-existent routes** or **placeholder (#)** targets. Compared to Lenskart, the site is missing **core e‑commerce and service features** (payment, real product/cart/order data, store locator, home eye test, try-at-home, virtual try-on flow, track order, prescriptions, contact lens orders) and several **supporting pages** (store locator, track order, warranty, blog, sitemap, etc.). This report lists gaps by category and gives prioritized recommendations.

---

## 2. Current State Overview

### 2.1 Implemented Routes & Pages

| Route | Page | Notes |
|-------|------|--------|
| `/` | Home (App) | Hero, categories, campaigns, shapes, nearby services, grids, featured. |
| `/search`, `/search/:category` | SearchPage | Filters + product grid; **filters/sort not applied**; category param **unused**. |
| `/product/:id` | ProductDetailPage | **Same sample product for all IDs**; `id` from URL not used. |
| `/cart` | CartPage | Sample cart; **no link from header**; "Proceed To Checkout" **does not navigate**. |
| `/checkout` | CheckoutPage | **Only address step**; no payment, no order creation. |
| `/order-success`, `/order-failure` | OrderSuccessPage, OrderFailurePage | Static/sample content. |
| `/account` | AccountPage | Dashboard with sample orders; order drawer (tracking, invoice, cancel, reorder). |
| `/account/3d-model` | My3DModelPage | Sample 3D models; delete UI only. |
| `/account/info` | AccountInfoPage | Profile form + change-password modal; local state. |
| `/account/notifications` | ManageNotificationsPage | Toggles (WhatsApp, SMS, push, email); local state. |
| `/account/address` | AddressBookPage | CRUD addresses; local state. |
| `/terms`, `/privacy`, `/refund-policy`, `/shipping-policy` | Policy pages | Static content. |
| `/faq` | FAQPage | Accordion FAQ + size chart. |
| `/contact` | ContactPage | Support categories, WhatsApp/email/phone/store. |
| `/about` | AboutPage | Story, quality, variety, value, trust. |
| `/support` | SupportPage | Quick links + "Connect with customer support" CTA. |
| `/500` | ServerErrorPage | Error message. |
| `*` | NotFoundPage | 404 with links. |

### 2.2 Key Features (Current Behavior)

- **Auth:** Login, Signup, Forgot Password modals – validation only; **no API, no session, no protected routes**.
- **Cart:** In-memory sample data; **no persistence**; checkout button does not navigate.
- **Checkout:** Address step only; **no payment step, no order submission**.
- **Wishlist:** Context + canvas; **in-memory only**.
- **Search:** Fixed `SAMPLE_PRODUCTS`; **filters and sort only log / don’t filter**.
- **Product detail:** Single sample product for all `/product/:id`.
- **Account:** Orders, addresses, profile, notifications, 3D models – **all sample/local state**.

---

## 3. Comparison with Lenskart (Reference)

Lenskart-style sites typically include:

- **Discovery:** Category/collection pages, search with filters, trending/sale, “Try @ Home”, “Home Eye Test”, store locator.
- **Product:** PDP with lens options, power selection, virtual try-on, “Try at Home” (physical trial), prescription upload.
- **Cart & Checkout:** Cart persistence, coupon, multiple addresses, **payment gateway** (UPI, cards, net banking, etc.), order placement.
- **Post-purchase:** Order confirmation, **track order** (by order ID/phone), invoice, cancel/return.
- **Account:** Profile, addresses, **order history**, **prescriptions**, **contact lens subscriptions**, 3D try-on history, notifications.
- **Services:** **Store locator** (find stores), **Home Eye Test** (book at-home test), **Try at Home** (order frames for trial).
- **Trust & support:** Warranty, return/refund, shipping, FAQ, contact, about, blog, sitemap, grievance, referral, careers, coupons.

---

## 4. Gap Analysis

### 4.1 Missing Pages (No Route or Only 404)

| Expected page / route | Referenced from | Priority |
|----------------------|-----------------|----------|
| **Track Order** (`/track-orders`) | PromotionHeader "Track Orders" | High |
| **Store Locator** (`/store-locator`) | Footer (Services), UTILITY_LINKS, CategoryNav | High |
| **Home Eye Test** (`/home-eye-test` or similar) | CategoryNav (e.g. home-eye-test) | High |
| **Try at Home** (e.g. `/try-at-home`) | NAV_CATEGORIES "Try @ Home", Lenskart equivalent | High |
| **Sale / Offers** (`/sale` or `/offers`) | CategoryNav "SALE", TOP_CATEGORIES "Sale" | Medium |
| **Category landing pages** | TOP_CATEGORIES, ShapeSection, Campaign | Medium |
| `/eyeglasses/rectangle`, `/eyeglasses/cateye`, etc. | EYEGLASS_SHAPES, SUNGLASS_SHAPES | Medium |
| `/category/eyeglasses`, `/category/sunglasses`, etc. | TOP_CATEGORIES links | Medium |
| **Warranty** (`/warranty`) | Footer, SupportPage quick link | Medium |
| **Return Policy** (alias or redirect) | Footer "Return Policy" → currently 404; refund is at `/refund-policy` | Low (fix link or add route) |
| **Blog** (`/blog`) | Footer | Low |
| **Sitemap** (`/sitemap`) | Footer | Low |
| **Disclaimer** (`/disclaimer`) | Footer bottom | Low |
| **Cookie Settings** (`/cookies`) | Footer bottom | Low |
| **Careers** (`/careers`) | Footer About Us "We Are Hiring" | Low |
| **Refer and Earn** (`/refer`) | Footer | Low |
| **Coupons** (`/coupons`) | Footer | Low |
| **Grievance Redressal** (`/grievance`) | Footer Help | Low |
| **Cardemi** (`/cardemi`) | Footer Help | Low |
| **Franchise** (`/franchise`) | Footer | Low |
| **Bulk Orders** (`/bulk-orders`) | Footer | Low |
| **Investors** (`/investors`) | Footer | Low |
| **Press** (`/press`) | Footer | Low |
| **Buying Guide** (`/buying-guide`) | Footer Services | Low |
| **Frame Size** (`/frame-size`) | Footer Services | Low |
| **Account – Prescriptions** (`/account/prescriptions`) | Account sidebar "MY PRESCRIPTIONS" | High |
| **Account – Contact Lens Orders** (`/account/contact-lens-orders`) | Account sidebar | Medium |
| **Campaign landing** (`/campaign`, `/campaign/2`, etc.) | Campaign component links | Low |

### 4.2 Missing or Incomplete Features / Modules

| Feature / module | Current state | Gap vs Lenskart |
|------------------|---------------|------------------|
| **Payment** | Checkout has no payment step; no gateway, no order creation | Add payment step (UPI, cards, net banking, etc.) and integrate with backend/gateway; create order on success. |
| **Order placement** | Checkout "Save Address & Proceed" does not advance to payment or submit order | Implement full flow: address → payment → place order → redirect to order-success/failure. |
| **Cart persistence** | Cart is in-memory only; lost on refresh | Persist cart (e.g. API or localStorage) and sync with backend if logged in. |
| **Cart in header** | Cart icon is button only; no `Link` to `/cart`; badge hardcoded "4" | Link cart icon to `/cart`; show real cart count. |
| **Proceed to checkout** | Cart "Proceed To Checkout" does not navigate to `/checkout` | Add navigation (e.g. `Link` or `useNavigate`) to `/checkout`. |
| **Search & filters** | Products = fixed list; `handleFilterChange` only logs; sort does not change list; `/search/:category` unused | Wire filters and sort to product list (API or client filter); use `category` param for category-specific results. |
| **Product listing by category** | Category/shape links go to non-existent routes | Add category/shape routes (or single `/search` with query params) and show filtered products. |
| **Product detail by ID** | `useParams()` not used; same sample product for every `/product/:id` | Use `id` from URL; fetch or resolve product by ID; show correct product. |
| **Virtual Try-On** | "Try On" on PDP and "Virtual Try On" on search are UI only; 3D model page is sample list | Implement or link to actual try-on flow (camera/upload, try-on result, save to account). |
| **Try at Home (physical)** | No booking or flow for trying frames at home | Add page/flow: select frames, book slot, delivery of trial frames (like Lenskart). |
| **Home Eye Test** | No booking or info page | Add page: info + book at-home eye test (like Lenskart). |
| **Store locator** | No page; link 404 | Add page: map/list of stores, search by location/pincode. |
| **Track order** | "Track Order" in header → 404; order drawer shows sample tracking | Add `/track-orders` (e.g. by order ID/phone); show real or mock tracking steps. |
| **Prescriptions** | "Upload prescription after payment" in cart; FAQ mentions upload; no prescriptions page | Add `/account/prescriptions`: list/upload prescriptions, link to orders. |
| **Contact lens orders** | Sidebar link goes to account dashboard (no dedicated page) | Add `/account/contact-lens-orders` or equivalent for contact lens order history. |
| **Auth & session** | Login/Signup/Forgot only validate and open/close modals; no API, no token, no protected routes | Integrate auth API; store session/token; protect account/checkout routes; optional "Remember me". |
| **Account data** | Profile, addresses, orders, notifications, 3D models – all sample/local state | Connect to backend APIs for profile, addresses, orders, notifications; persist 3D models if applicable. |
| **Wishlist persistence** | Wishlist in-memory only | Persist (API or localStorage) and sync when user logs in. |
| **Search submit** | Header search has no form submit or navigation to `/search?q=...` | On submit, navigate to `/search` with query; use in search page. |
| **Main nav links (home)** | NAV_CATEGORIES and UTILITY_LINKS use `#` (same-page anchor) | Either implement sections on home or link to real routes (e.g. `/search/eyeglasses`, `/store-locator`, `/try-at-home`). |

### 4.3 Broken or Placeholder Navigation

| Location | Issue |
|----------|--------|
| **Header (home)** | Logo not wrapped in `Link` to `/`; Cart button has no link to `/cart`; all nav items `href="#..."` (placeholder). |
| **PromotionHeader** | "Track Orders" → `/track-orders` (404). Category bar: `/home-eye-test`, `/store-locator`, `/sale` → no routes. Cart badge hardcoded "4"; cart icon not linked to `/cart`. |
| **Footer** | Many `<a href="...">` point to routes that don’t exist (see 4.1). "Return Policy" → consider redirect to `/refund-policy` or add `/return-policy`. |
| **Homepage** | Campaign links `/campaign`, `/campaign/2`, etc.; shape links `/eyeglasses/rectangle`, etc.; category links `/category/eyeglasses` → all 404. |
| **Support page** | "Warranty" quick link → `/warranty` (no route). |

### 4.4 Data & Backend Gaps

- **Products:** All from constants (`SAMPLE_PRODUCTS`, `SAMPLE_PRODUCT`); no API, no category/attribute-based listing.
- **Cart:** Sample `CART_ITEMS`; no add/update/remove persistence or API.
- **Orders:** Sample `SAMPLE_ORDERS`; no order creation or fetch from API.
- **User:** No real login/signup/forgot API; no user or session storage.
- **Addresses:** Local state only; no API for CRUD.
- **Prescriptions:** Mentioned in UI only; no upload or list API.
- **Stores:** No store locator data or API.
- **Coupons:** Coupon UI in cart; no validation or API.

---

## 5. Recommendations to Make the Site Full Ready

### 5.1 Critical (Core e‑commerce & navigation)

1. **Checkout flow:** Add payment step and order-placement logic; redirect to order-success/failure with order ID.
2. **Cart:** Add "Proceed To Checkout" navigation to `/checkout`; link header cart icon to `/cart` and show real cart count.
3. **Product detail:** Use `useParams().id` and load product by ID (API or static map).
4. **Search/listing:** Apply filters and sort to product list; use `/search/:category` (or query) for category filtering.
5. **Auth:** Integrate login/signup/forgot with backend; maintain session; protect account and checkout when needed.
6. **Track order:** Add `/track-orders` page (by order ID/phone) and fix "Track Orders" in header to link here.

### 5.2 High (Expected Lenskart-like pages & flows)

7. **Store locator:** Add `/store-locator` (map or list, search by location/pincode).
8. **Home Eye Test:** Add `/home-eye-test` (or similar) with info and booking flow.
9. **Try at Home:** Add try-at-home flow (e.g. select frames → book trial → delivery).
10. **Prescriptions:** Add `/account/prescriptions` (list/upload/link to orders).
11. **Category/shape landing:** Add routes for `/search?category=...` or `/eyeglasses/rectangle`, etc., and wire homepage links.

### 5.3 Medium (Trust, support, and polish)

12. **Warranty page:** Add `/warranty` and point footer/support link to it.
13. **Return policy link:** Point footer "Return Policy" to `/refund-policy` or add alias.
14. **Payment integration:** Integrate real payment gateway (e.g. Razorpay, Paytm) in checkout.
15. **Cart & wishlist persistence:** Persist via API or localStorage and sync when user logs in.
16. **Account data:** Connect profile, addresses, orders to backend APIs.
17. **Virtual Try-On:** Implement or integrate actual try-on flow and link from PDP/search.

### 5.4 Lower (Completeness and marketing)

18. **Sale/offers:** Add `/sale` or `/offers` and wire category nav.
19. **Contact lens orders:** Add `/account/contact-lens-orders` (or merge into orders with type).
20. **Campaign routes:** Add `/campaign`, `/campaign/:id` or redirect to relevant landing/search.
21. **Footer links:** Add minimal pages or redirects for Blog, Sitemap, Disclaimer, Cookies, Careers, Refer, Coupons, Grievance, Franchise, Bulk Orders, Investors, Press, Buying Guide, Frame Size, etc., or remove/hide links until pages exist.
22. **Main nav:** Replace `#` links with real routes (e.g. Eyeglasses → `/search/eyeglasses`, Stores → `/store-locator`, Try @ Home → `/try-at-home`).

---

## 6. Summary Table (Quick Reference)

| Category | Missing / incomplete |
|---------|----------------------|
| **Pages** | Track order, Store locator, Home eye test, Try at home, Sale, Category/shape landings, Warranty, Prescriptions, Contact lens orders, Blog, Sitemap, Disclaimer, Cookies, Careers, Refer, Coupons, Grievance, Franchise, Bulk, Investors, Press, Buying guide, Frame size, Campaign. |
| **Features** | Payment & order placement, cart persistence & header link & checkout navigation, search/filter/sort & category param, product-by-ID, virtual try-on, try-at-home, home eye test, store locator, track order, prescriptions, auth/session, account data from API, wishlist persistence, search submit. |
| **Navigation** | Header: cart link, nav items off `#`; PromotionHeader: track order route, cart link, category routes; Footer: many 404 links; Home: campaign, shape, category links. |

---

*Report generated for planning only. No code was modified. Prioritization can be adjusted based on business scope and backend availability.*
