import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute/ProtectedRoute";
import { AccountLayout } from "@/app/layouts";

// Lazy-loaded pages from feature locations (NOT old @/pages/)
const App = lazy(() => import("@/App").then(m => ({ default: m.default })));
const SearchPage = lazy(() => import("@/features/product/pages/SearchPage/SearchPage").then(m => ({ default: m.SearchPage })));
const ProductDetailPage = lazy(() => import("@/features/product/pages/ProductDetailPage/ProductDetailPage").then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import("@/features/cart").then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import("@/features/checkout").then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import("@/features/checkout").then(m => ({ default: m.OrderSuccessPage })));
const OrderFailurePage = lazy(() => import("@/features/checkout").then(m => ({ default: m.OrderFailurePage })));
const PaymentSuccessPage = lazy(() => import("@/features/checkout").then(m => ({ default: m.PaymentSuccessPage })));
const PaymentFailedPage = lazy(() => import("@/features/checkout").then(m => ({ default: m.PaymentFailedPage })));
const PaymentPendingPage = lazy(() => import("@/features/checkout").then(m => ({ default: m.PaymentPendingPage })));
const PaymentReturnPage = lazy(() => import("@/features/checkout").then(m => ({ default: m.PaymentReturnPage })));
const AccountPage = lazy(() => import("@/features/account").then(m => ({ default: m.AccountPage })));
// const My3DModelPage = lazy(() => import("@/features/account").then(m => ({ default: m.My3DModelPage }))); // [HIDDEN] My 3D Model — uncomment to restore
const AccountInfoPage = lazy(() => import("@/features/account").then(m => ({ default: m.AccountInfoPage })));
const ManageNotificationsPage = lazy(() => import("@/features/account").then(m => ({ default: m.ManageNotificationsPage })));
const AddressBookPage = lazy(() => import("@/features/account").then(m => ({ default: m.AddressBookPage })));
const AccountHomeTryOnAppointmentsPage = lazy(() => import("@/features/account").then(m => ({ default: m.AccountHomeTryOnAppointmentsPage })));
const TermsPage = lazy(() => import("@/features/account/pages/TermsPage/TermsPage").then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import("@/features/account/pages/PrivacyPage/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const RefundPolicyPage = lazy(() => import("@/features/account/pages/RefundPolicyPage/RefundPolicyPage").then(m => ({ default: m.RefundPolicyPage })));
const ShippingPolicyPage = lazy(() => import("@/features/account/pages/ShippingPolicyPage/ShippingPolicyPage").then(m => ({ default: m.ShippingPolicyPage })));
const FAQPage = lazy(() => import("@/features/account/pages/FAQPage/FAQPage").then(m => ({ default: m.FAQPage })));
const NotFoundPage = lazy(() => import("@/features/account/pages/NotFoundPage/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const ServerErrorPage = lazy(() => import("@/features/account/pages/ServerErrorPage/ServerErrorPage").then(m => ({ default: m.ServerErrorPage })));
const ContactPage = lazy(() => import("@/features/account/pages/ContactPage/ContactPage").then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import("@/features/account/pages/AboutPage/AboutPage").then(m => ({ default: m.AboutPage })));
const SupportPage = lazy(() => import("@/features/account/pages/SupportPage/SupportPage").then(m => ({ default: m.SupportPage })));
const TryAtHomePage = lazy(() => import("@/features/homeTryOn/pages/TryAtHomePage/TryAtHomePage").then(m => ({ default: m.TryAtHomePage })));
const WarrantyPage = lazy(() => import("@/features/account/pages/WarrantyPage/WarrantyPage").then(m => ({ default: m.WarrantyPage })));
const CollectionsPage = lazy(() => import("@/features/collections/pages/CollectionsPage/CollectionsPage").then(m => ({ default: m.CollectionsPage })));
const ServicesPage = lazy(() => import("@/features/account/pages/ServicesPage/ServicesPage").then(m => ({ default: m.ServicesPage })));
const HomePage2 = lazy(() => import("@/features/home/pages/HomePage2/HomePage2").then(m => ({ default: m.HomePage2 })));
const HomeTryOnPage = lazy(() => import("@/features/homeTryOn/pages/HomeTryOnPage/HomeTryOnPage").then(m => ({ default: m.HomeTryOnPage })));
const HomeTryOnBookingPage = lazy(() => import("@/features/homeTryOn/pages/HomeTryOnBookingPage/HomeTryOnBookingPage").then(m => ({ default: m.HomeTryOnBookingPage })));
const MyHomeTryOnPage = lazy(() => import("@/features/account").then(m => ({ default: m.MyHomeTryOnPage })));
const MyHomeTryOnAppointmentsPage = lazy(() => import("@/features/account").then(m => ({ default: m.MyHomeTryOnAppointmentsPage })));
const StoresPage = lazy(() => import("@/features/store/pages/StoresPage/StoresPage").then(m => ({ default: m.StoresPage })));
const FindNearestStorePage = lazy(() => import("@/features/store/pages/FindNearestStorePage/FindNearestStorePage").then(m => ({ default: m.FindNearestStorePage })));
const WishlistPage = lazy(() => import("@/features/wishlist/pages/WishlistPage/WishlistPage").then(m => ({ default: m.WishlistPage })));
const OnlineEyeTestPage = lazy(() => import("@/features/eyetest/pages/OnlineEyeTestPage/OnlineEyeTestPage").then(m => ({ default: m.OnlineEyeTestPage })));
const VisionScreeningDisclaimerPage = lazy(() => import("@/features/eyetest/pages/VisionScreeningDisclaimerPage/VisionScreeningDisclaimerPage").then(m => ({ default: m.VisionScreeningDisclaimerPage })));
const BrightnessSetupPage = lazy(() => import("@/features/eyetest/pages/BrightnessSetupPage/BrightnessSetupPage").then(m => ({ default: m.BrightnessSetupPage })));
const DeviceCheckPage = lazy(() => import("@/features/eyetest/pages/DeviceCheckPage/DeviceCheckPage").then(m => ({ default: m.DeviceCheckPage })));
const EyeTestApp = lazy(() => import("@/features/eyetest/pages/OnlineEyeTestApp/EyeTestApp").then(m => ({ default: m.EyeTestApp })));
const TrackOrderPage = lazy(() => import("@/features/orderTracking/pages/TrackOrderPage/TrackOrderPage").then(m => ({ default: m.TrackOrderPage })));

export const routes: RouteObject[] = [
  { path: "/", element: <App /> },
  { path: "/home-2", element: <HomePage2 /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/search/:category", element: <SearchPage /> },
  { path: "/category/:category", element: <SearchPage /> },
  { path: "/product/:id", element: <ProductDetailPage /> },
  { path: "/wishlist", element: <ProtectedRoute><WishlistPage /></ProtectedRoute> },
  { path: "/cart", element: <ProtectedRoute><CartPage /></ProtectedRoute> },
  { path: "/checkout", element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
  { path: "/order-success/:id", element: <ProtectedRoute><OrderSuccessPage /></ProtectedRoute> },
  { path: "/order-failure", element: <OrderFailurePage /> },
  { path: "/track", element: <TrackOrderPage /> },
  { path: "/track/:orderId", element: <TrackOrderPage /> },
  { path: "/payment/success", element: <PaymentSuccessPage /> },
  { path: "/payment/failed", element: <PaymentFailedPage /> },
  { path: "/payment/pending", element: <PaymentPendingPage /> },
  { path: "/payment-return", element: <ProtectedRoute><PaymentReturnPage /></ProtectedRoute> },
  // SkipCash gateway return URL (/payment-success?ref=...) — same handler as
  // /payment-return: resolves the order via ref, then shows OrderSuccessPage
  { path: "/payment-success", element: <ProtectedRoute><PaymentReturnPage /></ProtectedRoute> },
  {
    element: <ProtectedRoute><AccountLayout /></ProtectedRoute>,
    children: [
      { path: "/account", element: <AccountPage /> },
      { path: "/account/orders", element: <AccountPage /> },
      // { path: "/account/3d-model", element: <My3DModelPage /> }, // [HIDDEN] My 3D Model — uncomment to restore
      { path: "/account/info", element: <AccountInfoPage /> },
      { path: "/account/notifications", element: <ManageNotificationsPage /> },
      { path: "/account/address", element: <AddressBookPage /> },
      { path: "/account/home-try-on-appointments", element: <AccountHomeTryOnAppointmentsPage /> },

    ],
  },
  { path: "/terms", element: <TermsPage /> },
  { path: "/privacy", element: <PrivacyPage /> },
  { path: "/refund-policy", element: <RefundPolicyPage /> },
  { path: "/shipping-policy", element: <ShippingPolicyPage /> },
  { path: "/faq", element: <FAQPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/support", element: <SupportPage /> },
  { path: "/try-at-home", element: <TryAtHomePage /> },
  { path: "/home-try-on", element: <HomeTryOnPage /> },
  { path: "/home-try-on/book", element: <ProtectedRoute><HomeTryOnBookingPage /></ProtectedRoute> },
  { path: "/my-home-try-on", element: <ProtectedRoute><MyHomeTryOnPage /></ProtectedRoute> },
  { path: "/my-home-try-on-appointments", element: <ProtectedRoute><MyHomeTryOnAppointmentsPage /></ProtectedRoute> },
  { path: "/find-nearest-store", element: <FindNearestStorePage /> },
  { path: "/stores", element: <StoresPage /> },
  { path: "/warranty", element: <WarrantyPage /> },
  { path: "/online-eye-test/screening", element: <VisionScreeningDisclaimerPage /> },
  { path: "/online-eye-test/instructions", element: <BrightnessSetupPage /> },
  { path: "/online-eye-test/device-check", element: <DeviceCheckPage /> },
  { path: "/online-eye-test/app", element: <EyeTestApp /> },
  { path: "/online-eye-test", element: <OnlineEyeTestPage /> },
  { path: "/collections", element: <CollectionsPage /> },
  { path: "/brands", element: <CollectionsPage /> },
  { path: "/services", element: <ServicesPage /> },
  { path: "/500", element: <ServerErrorPage /> },
  { path: "*", element: <NotFoundPage /> },
];
