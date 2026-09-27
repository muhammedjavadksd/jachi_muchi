/**
 * Titles and descriptions for pages that must be kept out of the search index.
 *
 * Consumed via `<SEO {...noIndexMeta.x} noIndex />` by the protected,
 * transactional and order-result pages. Each entry renders
 * `<meta name="robots" content="noindex, nofollow" />`.
 *
 * No `canonicalPath` is supplied on purpose: a canonical link on a `noindex`
 * page is meaningless at best and confusing at worst, so these pages emit no
 * canonical / `og:url`.
 *
 * These pages are additionally disallowed in `public/robots.txt`, which is the
 * layer that actually protects the *gated* ones (cart, checkout, account,
 * wishlist, booking). Those pages sit behind `ProtectedRoute`, which redirects
 * an anonymous visitor to `/?login=true` before the page component ever mounts,
 * so no `/cart` document is ever rendered and the `noindex` tag below is not
 * observable for them. The disallow plus that redirect is the real protection
 * for those URLs; the tag here still applies whenever the page does render for
 * a signed-in visitor.
 *
 * For the ungated transactional pages (`/order-failure`, `/track`,
 * `/payment/success|failed|pending`) the `<meta name="robots">` tag below is
 * the operative protection, since those render for anyone and are crawled
 * directly.
 */

export interface NoIndexMetaEntry {
  title: string;
  description: string;
}

export const noIndexMeta = {
  wishlist: {
    title: "Your Wishlist | Jachi & Muchi",
    description: "Sign in to view the frames and sunglasses you have saved.",
  },
  cart: {
    title: "Shopping Bag | Jachi & Muchi",
    description: "Sign in to review the items in your bag and check out.",
  },
  checkout: {
    title: "Checkout | Jachi & Muchi",
    description: "Sign in to complete your order and choose a delivery address.",
  },
  orderSuccess: {
    title: "Order Confirmed | Jachi & Muchi",
    description: "Your order has been placed. A confirmation has been sent to you.",
  },
  orderFailure: {
    title: "Order Not Completed | Jachi & Muchi",
    description: "We could not complete your order. Please try again.",
  },
  account: {
    title: "My Account | Jachi & Muchi",
    description: "Sign in to manage your orders, addresses and account settings.",
  },
  accountInfo: {
    title: "Profile Settings | Jachi & Muchi",
    description: "Sign in to update your personal details and password.",
  },
  accountNotifications: {
    title: "Notification Preferences | Jachi & Muchi",
    description: "Sign in to choose how you want to receive order updates.",
  },
  accountAddress: {
    title: "Saved Addresses | Jachi & Muchi",
    description: "Sign in to manage your delivery and billing addresses.",
  },
  accountHomeTryOnAppointments: {
    title: "My Home Try-On Appointments | Jachi & Muchi",
    description: "Sign in to review or manage your booked home try-on appointments.",
  },
  accountReturns: {
    title: "My Returns | Jachi & Muchi",
    description: "Sign in to start a return or track an existing return request.",
  },
  trackOrder: {
    title: "Track Your Order | Jachi & Muchi",
    description: "Sign in or enter your order details to check your delivery status.",
  },
  paymentReturn: {
    title: "Payment Confirmation | Jachi & Muchi",
    description: "We are confirming your payment. Please do not close this window.",
  },
  paymentSuccess: {
    title: "Payment Successful | Jachi & Muchi",
    description: "Your payment was received. We are processing your order.",
  },
  paymentFailed: {
    title: "Payment Failed | Jachi & Muchi",
    description: "Your payment could not be completed. Please try another method.",
  },
  paymentPending: {
    title: "Payment Pending | Jachi & Muchi",
    description: "Your payment is being verified. This page will update shortly.",
  },
  homeTryOnBooking: {
    title: "Book a Home Try-On | Jachi & Muchi",
    description: "Sign in to book a 60-minute home try-on with an optometrist.",
  },
  myHomeTryOn: {
    title: "My Home Try-On | Jachi & Muchi",
    description: "Sign in to book or manage your at-home optometrist visits.",
  },
  myHomeTryOnAppointments: {
    title: "My Home Try-On Appointments | Jachi & Muchi",
    description: "Sign in to view your upcoming and past home try-on appointments.",
  },
} satisfies Record<string, NoIndexMetaEntry>;
