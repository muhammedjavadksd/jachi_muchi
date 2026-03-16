# Sitemap Gap Report  
**Project:** Jachi Muchi (Lenskart-style eyewear)  
**Reference:** Lenskart/OWNDAYS-style sitemap (Frames, Sunglasses, Collections, Services, Support, About)  
**Purpose:** Identify missing pages and URL structure vs reference sitemap; no code edits.  
**Date:** February 2025  

---

## 1. Reference Sitemap Structure (Summary)

The reference sitemap is organized into **6 main sections** with nested links:

| Section        | Contents |
|----------------|----------|
| **Frames**     | Frames overview, All frames, Frame shape (Rectangle, Boston, Oval, Browline, Round, Rimless, Wellington, Other), Gender (Men, Women, Kids), Frame material (Plastic, Metal, Resin, Celluloid, Titanium, Stainless Steel, Other), Frame colour (16 options). |
| **Sunglasses**  | Sunglasses overview, All sunglasses, same sub-categories (shape, gender Men/Women, material, colour). |
| **Collections** | All collections/brands, then many collection-specific listing pages (e.g. by product line/brand). |
| **Services**   | All services, Customer guarantees/warranty, Lens guide, Staff, Lens replacement. |
| **Support**    | Shops (store locator), FAQ, Contact us, New users guide, Sign up, Log in, System requirements, Site map. |
| **About**      | Membership/Account, Care programme, Corporate information, EYE CAMP–type page, Recruitment, Privacy policy, Terms & conditions, Membership terms. |

Reference URLs use patterns such as:
- `/eyeglasses`, `/sunglasses` (overview)
- `/products?productTypes[]=1|2&frameTypes[]=…&targetMarkets[]=…&materials[]=…&colorAttributes[]=…` (filtered listings)
- `/brands`, `/products?productLines[]=…` (collections)
- `/services`, `/services/warranty`, `/services/lens`, etc.
- `/shops`, `/faq`, `/contact`, `/sitemap`, `/account`, `/company`, `/privacy`, `/terms`, `/membership-terms`

---

## 2. Current Project Routes (What Exists)

| Route | Purpose |
|-------|---------|
| `/` | Home |
| `/search`, `/search/:category` | Listing (category param not used; no query filters) |
| `/product/:id` | Product detail (id not used; same sample) |
| `/cart`, `/checkout`, `/order-success`, `/order-failure` | Cart & checkout |
| `/account`, `/account/3d-model`, `/account/info`, `/account/notifications`, `/account/address` | Account |
| `/terms`, `/privacy`, `/refund-policy`, `/shipping-policy` | Policies |
| `/faq`, `/contact`, `/about`, `/support`, `/try-at-home`, `/warranty` | Info & support |
| `/500`, `*` (404) | Error pages |

**No route exists for:** `/sitemap`, `/eyeglasses`, `/sunglasses`, `/brands`, `/store-locator`, `/track-orders`, `/services`, `/buying-guide`, `/frame-size`, `/blog`, `/disclaimer`, `/cookies`, `/careers`, `/refer`, `/coupons`, `/grievance`, `/franchise`, `/bulk-orders`, `/investors`, `/press`, `/account/prescriptions`, `/account/contact-lens-orders`, category/shape/material/colour filtered listing URLs, or campaign/brand landing pages.

---

## 3. Gap: Missing vs Reference Sitemap

### 3.1 Sitemap Page Itself

| Reference | Current | Gap |
|-----------|---------|-----|
| `/sitemap` (page listing all sections/links) | Footer links to `/sitemap` but **no route** → 404 | **Missing:** Sitemap page and route. |

---

### 3.2 Frames Section

| Reference item | Current | Gap |
|----------------|---------|-----|
| Frames overview (`/eyeglasses`) | No route | **Missing:** `/eyeglasses` (or equivalent) |
| All frames (product listing for type “frames”) | `/search` exists; no `/eyeglasses` or `?productTypes[]=1` | **Missing:** Dedicated frames entry; search does not use query params for product type |
| Frame shape links (Rectangle, Boston, Oval, Round, etc.) | Homepage shape links go to e.g. `/eyeglasses/rectangle` – **no routes** | **Missing:** All shape listing URLs (or `/search?frameShape=…`) |
| Gender (Men, Women, Kids) | No gender-filtered URLs | **Missing:** e.g. `/search?targetMarket=men|women|kids` or category pages |
| Frame material (Plastic, Metal, etc.) | Filter sidebar exists but filters don’t change results; no material URLs | **Missing:** Material-filtered URLs / applied filters |
| Frame colour (Black, Blue, etc.) | Same as above | **Missing:** Colour-filtered URLs / applied filters |

**Summary – Frames:** No frames overview page, no working filtered listing URLs for shape, gender, material, or colour.

---

### 3.3 Sunglasses Section

| Reference item | Current | Gap |
|----------------|---------|-----|
| Sunglasses overview (`/sunglasses`) | No route | **Missing:** `/sunglasses` |
| All sunglasses | Only generic `/search` | **Missing:** Dedicated sunglasses listing (e.g. `/search/sunglasses` or `?productTypes[]=2`) |
| Shape / Gender / Material / Colour for sunglasses | Same as Frames | **Missing:** All filtered listing URLs for sunglasses |

**Summary – Sunglasses:** No sunglasses overview, no sunglasses-specific filtered links.

---

### 3.4 Collections / Brands Section

| Reference item | Current | Gap |
|----------------|---------|-----|
| All collections (`/brands`) | No route | **Missing:** `/brands` (or `/collections`) |
| Collection/brand listing pages (`/products?productLines[]=…`) | No brand/collection routes or query support | **Missing:** Any collection or brand listing pages and URL pattern |

**Summary – Collections:** No brands/collections hub, no per-brand or per-collection listing URLs.

---

### 3.5 Services Section

| Reference item | Current | Gap |
|----------------|---------|-----|
| All services (`/services`) | No route | **Missing:** `/services` (hub page) |
| Customer guarantees / warranty | `/warranty` exists | **Present** |
| Lens guide | No route | **Missing:** `/services/lens` or `/lens-guide` or `/buying-guide` |
| Staff | No route | **Missing:** Optional `/services/staff` (or similar) |
| Lens replacement | No route | **Missing:** `/services/lens-replacement` (or similar) |

**Summary – Services:** Missing services hub and lens/staff/lens-replacement pages; warranty present.

---

### 3.6 Support Section

| Reference item | Current | Gap |
|----------------|---------|-----|
| Shops / store locator | No route | **Missing:** `/store-locator` (or `/shops`) |
| FAQ | `/faq` exists | **Present** |
| Contact us | `/contact` exists | **Present** |
| New users guide | No route | **Missing:** `/new-users` or `/guide` (or linked from FAQ) |
| Sign up / Log in | Modals only; no dedicated pages | **Partial:** No `/register`, `/login` pages (reference has dedicated URLs) |
| System requirements | No route | **Missing:** `/system-requirements` (or similar) |
| Site map | No route | **Missing:** `/sitemap` |

**Summary – Support:** Missing store locator, new-users page, system-requirements page, and sitemap page; FAQ and contact present.

---

### 3.7 About Section

| Reference item | Current | Gap |
|----------------|---------|-----|
| Membership / Account | `/account` exists | **Present** |
| Care programme (e.g. care+) | No route | **Missing:** `/care` or `/membership-benefits` (or similar) |
| Corporate information | `/about` exists (company story) | **Partial:** Could be considered equivalent or add `/company` |
| EYE CAMP–type / initiatives | No route | **Missing:** Optional initiative/campaign page |
| Recruitment | No route | **Missing:** `/careers` (or external link) |
| Privacy policy | `/privacy` exists | **Present** |
| Terms & conditions | `/terms` exists | **Present** |
| Membership programme terms | No route | **Missing:** `/membership-terms` (or fold into `/terms`) |

**Summary – About:** Missing care/membership-benefits page, recruitment/careers, membership terms; account, about, privacy, terms present.

---

## 4. Missing Pages Checklist (Actionable List)

Use this list to add routes and/or a sitemap page.

### 4.1 High impact (core navigation & discovery)

- [ ] **Sitemap page** – `/sitemap` (single page that links to all sections below where implemented).
- [ ] **Frames overview** – `/eyeglasses` (or redirect to `/search?type=eyeglasses`).
- [ ] **Sunglasses overview** – `/sunglasses` (or redirect to `/search?type=sunglasses`).
- [ ] **Store locator** – `/store-locator` (or `/shops`).
- [ ] **Filtered product URLs** – Ensure `/search` (or category routes) support query params or path for:
  - Product type (frames / sunglasses)
  - Frame shape
  - Gender (men / women / kids)
  - Material
  - Colour  
  (Reference uses query params like `productTypes[]`, `frameTypes[]`, `targetMarkets[]`, `materials[]`, `colorAttributes[]`.)

### 4.2 Medium impact (services & support)

- [ ] **Services hub** – `/services` (links to warranty, lens guide, etc.).
- [ ] **Lens guide** – `/lens-guide` or `/services/lens` or merge into `/buying-guide`.
- [ ] **Buying guide** – `/buying-guide` (footer already links here; currently 404).
- [ ] **New users guide** – `/new-users` or `/guide`.
- [ ] **System requirements** – `/system-requirements` (optional).
- [ ] **Lens replacement** – `/services/lens-replacement` (optional).

### 4.3 Lower impact (about & policies)

- [ ] **Collections / brands** – `/brands` or `/collections` (and optionally per-brand listing URLs).
- [ ] **Care / membership benefits** – `/care` or `/membership-benefits`.
- [ ] **Careers** – `/careers` (footer “We Are Hiring”).
- [ ] **Membership terms** – `/membership-terms` or section in `/terms`.
- [ ] **Staff** – `/services/staff` (optional).
- [ ] **Blog** – `/blog` (optional).
- [ ] **Disclaimer** – `/disclaimer`.
- [ ] **Cookie settings** – `/cookies`.
- [ ] **Refer and earn** – `/refer`.
- [ ] **Coupons** – `/coupons`.
- [ ] **Grievance** – `/grievance`.
- [ ] **Franchise, Bulk orders, Investors, Press** – Add routes or remove footer links.

---

## 5. Suggested Sitemap Page Content (Once Routes Exist)

When you add a **Sitemap** page at `/sitemap`, structure it like the reference, with sections and links only to routes that exist (to avoid 404s). Example outline:

1. **Frames**  
   - Frames overview → `/eyeglasses` (when added)  
   - All frames → `/search` or `/search/eyeglasses`  
   - Frame shape → `/search?shape=…` (when filters work)  
   - Gender / Material / Colour → same pattern when supported  

2. **Sunglasses**  
   - Sunglasses overview → `/sunglasses`  
   - All sunglasses → `/search/sunglasses` or `/search?type=sunglasses`  
   - Sub-categories as above when available  

3. **Collections** (optional)  
   - All collections → `/brands`  
   - Per-brand links when you have collection/brand pages  

4. **Services**  
   - All services → `/services`  
   - Warranty → `/warranty`  
   - Lens guide / Buying guide → `/lens-guide`, `/buying-guide`  
   - Lens replacement, Staff → if you add those routes  

5. **Support**  
   - Shops → `/store-locator`  
   - FAQ → `/faq`  
   - Contact → `/contact`  
   - New users → `/new-users` (or FAQ)  
   - Sign up / Log in → keep as modals or add `/register`, `/login`  
   - System requirements → `/system-requirements` (if added)  
   - Site map → `/sitemap`  

6. **About**  
   - Account / Membership → `/account`  
   - About / Corporate → `/about`  
   - Care / Membership benefits → `/care` (if added)  
   - Careers → `/careers`  
   - Privacy → `/privacy`  
   - Terms → `/terms`  
   - Membership terms → `/membership-terms` (if added)  

Breadcrumb: e.g. Home → Site Map.  
Title: **SITE MAP** (or “Site Map”).

---

## 6. Summary Table

| Reference section | Overview / hub | Filtered / sub-pages | Current project |
|-------------------|----------------|----------------------|------------------|
| **Frames**       | `/eyeglasses`  | Shape, gender, material, colour | Missing overview; no working filter URLs |
| **Sunglasses**    | `/sunglasses`  | Same                 | Missing overview; no filter URLs |
| **Collections**  | `/brands`      | Per brand/line       | All missing |
| **Services**     | `/services`    | Warranty, lens, staff, lens replacement | Warranty only; rest missing |
| **Support**      | —              | Shops, FAQ, Contact, New users, Sign up, Log in, System req., Sitemap | FAQ, Contact present; Sitemap, Shops, New users, System req. missing |
| **About**        | —              | Account, Care, Company, Recruitment, Privacy, Terms, Membership terms | Account, About, Privacy, Terms present; Care, Careers, Membership terms missing |

**Single most important missing piece for “sitemap like Lenskart”:** A **Sitemap page at `/sitemap`** that lists all existing sections and links, plus **Frames** and **Sunglasses** overview/filtered URLs and a **Store locator** page so the Support and discovery sections are usable.

---

*Report only; no code or routes were added. Implement routes and the sitemap page as needed, then update the sitemap page links so they do not 404.*
