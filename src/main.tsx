import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { SearchPage, ProductDetailPage, CartPage, CheckoutPage, OrderSuccessPage, OrderFailurePage, AccountPage, My3DModelPage, AccountInfoPage, ManageNotificationsPage, AddressBookPage, TermsPage, PrivacyPage, RefundPolicyPage, ShippingPolicyPage, FAQPage, NotFoundPage, ServerErrorPage, ContactPage, AboutPage, SupportPage, TryAtHomePage, WarrantyPage, CollectionsPage, ServicesPage, HomePage2, HomeTryOnPage, StoresPage } from "./pages";
import { WishlistProvider } from "./context/WishlistContext";
import { LoginModalProvider } from "./context/LoginModalContext";
import { SignupModalProvider } from "./context/SignupModalContext";
import { ForgotPasswordModalProvider } from "./context/ForgotPasswordModalContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistCanvas } from "./components/WishlistCanvas/WishlistCanvas";
import { LoginModal } from "./components/LoginModal/LoginModal";
import { SignupModal } from "./components/SignupModal/SignupModal";
import { ForgotPasswordModal } from "./components/ForgotPasswordModal/ForgotPasswordModal";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <LoginModalProvider>
          <SignupModalProvider>
            <ForgotPasswordModalProvider>
              <WishlistProvider>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/home-2" element={<HomePage2 />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/search/:category" element={<SearchPage />} />
                <Route path="/category/:category" element={<SearchPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/order-failure" element={<OrderFailurePage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/3d-model" element={<My3DModelPage />} />
                <Route path="/account/info" element={<AccountInfoPage />} />
                <Route path="/account/notifications" element={<ManageNotificationsPage />} />
                <Route path="/account/address" element={<AddressBookPage />} />
                <Route path="/account/*" element={<AccountPage />} />

                
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/refund-policy" element={<RefundPolicyPage />} />
                <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/try-at-home" element={<TryAtHomePage />} />
                <Route path="/home-try-on" element={<HomeTryOnPage />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/warranty" element={<WarrantyPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/brands" element={<CollectionsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/500" element={<ServerErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <WishlistCanvas />
              <LoginModal />
              <SignupModal />
              <ForgotPasswordModal />
            </WishlistProvider>
          </ForgotPasswordModalProvider>
        </SignupModalProvider>
      </LoginModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
