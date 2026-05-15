import { lazy } from "react";

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  protected?: boolean;
}

const SearchPage = lazy(() => import("../pages/SearchPage/SearchPage").then(m => ({ default: m.SearchPage })));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage/ProductDetailPage").then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import("../pages/CartPage/CartPage").then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import("../pages/OrderSuccessPage/OrderSuccessPage").then(m => ({ default: m.OrderSuccessPage })));
const OrderFailurePage = lazy(() => import("../pages/OrderFailurePage/OrderFailurePage").then(m => ({ default: m.OrderFailurePage })));
const AccountPage = lazy(() => import("../pages/AccountPage/AccountPage").then(m => ({ default: m.AccountPage })));
const My3DModelPage = lazy(() => import("../pages/My3DModelPage/My3DModelPage").then(m => ({ default: m.My3DModelPage })));
const AccountInfoPage = lazy(() => import("../pages/AccountInfoPage/AccountInfoPage").then(m => ({ default: m.AccountInfoPage })));
const ManageNotificationsPage = lazy(() => import("../pages/ManageNotificationsPage/ManageNotificationsPage").then(m => ({ default: m.ManageNotificationsPage })));
const AddressBookPage = lazy(() => import("../pages/AddressBookPage/AddressBookPage").then(m => ({ default: m.AddressBookPage })));
const TermsPage = lazy(() => import("../pages/TermsPage/TermsPage").then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import("../pages/PrivacyPage/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const RefundPolicyPage = lazy(() => import("../pages/RefundPolicyPage/RefundPolicyPage").then(m => ({ default: m.RefundPolicyPage })));
const ShippingPolicyPage = lazy(() => import("../pages/ShippingPolicyPage/ShippingPolicyPage").then(m => ({ default: m.ShippingPolicyPage })));
const FAQPage = lazy(() => import("../pages/FAQPage/FAQPage").then(m => ({ default: m.FAQPage })));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const ServerErrorPage = lazy(() => import("../pages/ServerErrorPage/ServerErrorPage").then(m => ({ default: m.ServerErrorPage })));
const ContactPage = lazy(() => import("../pages/ContactPage/ContactPage").then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import("../pages/AboutPage/AboutPage").then(m => ({ default: m.AboutPage })));
const SupportPage = lazy(() => import("../pages/SupportPage/SupportPage").then(m => ({ default: m.SupportPage })));
const TryAtHomePage = lazy(() => import("../pages/TryAtHomePage/TryAtHomePage").then(m => ({ default: m.TryAtHomePage })));
const WarrantyPage = lazy(() => import("../pages/WarrantyPage/WarrantyPage").then(m => ({ default: m.WarrantyPage })));
const CollectionsPage = lazy(() => import("../pages/CollectionsPage/CollectionsPage").then(m => ({ default: m.CollectionsPage })));
const ServicesPage = lazy(() => import("../pages/ServicesPage/ServicesPage").then(m => ({ default: m.ServicesPage })));
const HomePage2 = lazy(() => import("../pages/HomePage2/HomePage2").then(m => ({ default: m.HomePage2 })));
const HomeTryOnPage = lazy(() => import("../pages/HomeTryOnPage/HomeTryOnPage").then(m => ({ default: m.HomeTryOnPage })));
const StoresPage = lazy(() => import("../pages/StoresPage/StoresPage").then(m => ({ default: m.StoresPage })));
const WishlistPage = lazy(() => import("../pages/WishlistPage/WishlistPage").then(m => ({ default: m.WishlistPage })));

export const ROUTES: RouteConfig[] = [
  { path: "/home-2", component: HomePage2 },
  { path: "/search", component: SearchPage },
  { path: "/search/:category", component: SearchPage },
  { path: "/category/:category", component: SearchPage },
  { path: "/product/:id", component: ProductDetailPage },
  { path: "/wishlist", component: WishlistPage, protected: true },
  { path: "/cart", component: CartPage, protected: true },
  { path: "/checkout", component: CheckoutPage, protected: true },
  { path: "/order-success/:id", component: OrderSuccessPage, protected: true },
  { path: "/order-failure", component: OrderFailurePage },
  { path: "/account", component: AccountPage, protected: true },
  { path: "/account/3d-model", component: My3DModelPage, protected: true },
  { path: "/account/info", component: AccountInfoPage, protected: true },
  { path: "/account/notifications", component: ManageNotificationsPage, protected: true },
  { path: "/account/address", component: AddressBookPage, protected: true },
  { path: "/account/*", component: AccountPage, protected: true },
  { path: "/terms", component: TermsPage },
  { path: "/privacy", component: PrivacyPage },
  { path: "/refund-policy", component: RefundPolicyPage },
  { path: "/shipping-policy", component: ShippingPolicyPage },
  { path: "/faq", component: FAQPage },
  { path: "/contact", component: ContactPage },
  { path: "/about", component: AboutPage },
  { path: "/support", component: SupportPage },
  { path: "/try-at-home", component: TryAtHomePage },
  { path: "/home-try-on", component: HomeTryOnPage },
  { path: "/stores", component: StoresPage },
  { path: "/warranty", component: WarrantyPage },
  { path: "/collections", component: CollectionsPage },
  { path: "/brands", component: CollectionsPage },
  { path: "/services", component: ServicesPage },
  { path: "/500", component: ServerErrorPage },
  { path: "*", component: NotFoundPage },
];
