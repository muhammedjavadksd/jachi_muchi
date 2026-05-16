import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import {
  SearchPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrderSuccessPage,
  OrderFailurePage,
  AccountPage,
  My3DModelPage,
  AccountInfoPage,
  ManageNotificationsPage,
  AddressBookPage,
  TermsPage,
  PrivacyPage,
  RefundPolicyPage,
  ShippingPolicyPage,
  FAQPage,
  NotFoundPage,
  ServerErrorPage,
  ContactPage,
  AboutPage,
  SupportPage,
  TryAtHomePage,
  WarrantyPage,
  CollectionsPage,
  ServicesPage,
  HomePage2,
  HomeTryOnPage,
  HomeTryOnBookingPage,
  StoresPage,
  WishlistPage,
  MyHomeTryOnPage,
  MyHomeTryOnAppointmentsPage,
  AccountHomeTryOnAppointmentsPage,
} from "./pages";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { LoginModalProvider } from "./context/LoginModalContext";
import { SignupModalProvider } from "./context/SignupModalContext";
import { ForgotPasswordModalProvider } from "./context/ForgotPasswordModalContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistCanvas } from "./components/WishlistCanvas/WishlistCanvas";
import { LoginModal } from "./components/LoginModal/LoginModal";
import { SignupModal } from "./components/SignupModal/SignupModal";
import { ForgotPasswordModal } from "./components/ForgotPasswordModal/ForgotPasswordModal";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
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
        <CartProvider>
        <LoginModalProvider>
          <SignupModalProvider>
            <ForgotPasswordModalProvider>
              <WishlistProvider>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/home-2" element={<HomePage2 />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/search/:category" element={<SearchPage />} />
                <Route path="/category/:category" element={<SearchPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                <Route path="/order-failure" element={<OrderFailurePage />} />
                <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                <Route path="/account/3d-model" element={<ProtectedRoute><My3DModelPage /></ProtectedRoute>} />
                <Route path="/account/info" element={<ProtectedRoute><AccountInfoPage /></ProtectedRoute>} />
                <Route path="/account/notifications" element={<ProtectedRoute><ManageNotificationsPage /></ProtectedRoute>} />
                <Route path="/account/address" element={<ProtectedRoute><AddressBookPage /></ProtectedRoute>} />
                <Route path="/account/home-try-on-appointments" element={<ProtectedRoute><AccountHomeTryOnAppointmentsPage /></ProtectedRoute>} />
                <Route path="/account/*" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
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
                <Route path="/home-try-on/book" element={<ProtectedRoute><HomeTryOnBookingPage /></ProtectedRoute>} />
                <Route path="/my-home-try-on" element={<ProtectedRoute><MyHomeTryOnPage /></ProtectedRoute>} />
                <Route path="/my-home-try-on-appointments" element={<ProtectedRoute><MyHomeTryOnAppointmentsPage /></ProtectedRoute>} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/warranty" element={<WarrantyPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/brands" element={<CollectionsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/500" element={<ServerErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              </Suspense>
                <WishlistCanvas />
                <LoginModal />
                <SignupModal />
                <ForgotPasswordModal />
              </WishlistProvider>
            </ForgotPasswordModalProvider>
          </SignupModalProvider>
        </LoginModalProvider>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
