import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "@/app/routes";
import { AuthProvider, CartProvider, LoginModalProvider, SignupModalProvider, ForgotPasswordModalProvider, WishlistProvider } from "@/app/providers";
import { WishlistCanvas } from "@/features/wishlist/components/WishlistCanvas/WishlistCanvas";
import { LoginModal } from "@/features/auth/components/LoginModal/LoginModal";
import { SignupModal } from "@/features/auth/components/SignupModal/SignupModal";
import { ForgotPasswordModal } from "@/features/auth/components/ForgotPasswordModal/ForgotPasswordModal";
import { ReturnFormModal } from "@/features/returns/components/ReturnFormModal/ReturnFormModal";
import { ScrollToTop } from "@/shared/components/ScrollToTop/ScrollToTop";
import { LoadingScreen } from "@/shared/components/LoadingScreen/LoadingScreen";
import { usePageTracking } from "@/hooks/usePageTracking";
import { HelmetProvider } from "react-helmet-async";
import { SEO } from "@/shared/components/SEO/SEO";
import { defaultMeta } from "@/shared/constants/seoMeta";
import { Toaster } from "react-hot-toast";
import "./styles.css";

function AppRoutes() {
  return useRoutes(routes);
}

/**
 * Mounted once, above the router outlet, so GA4 page views are reported for
 * every route — including the `/online-eye-test/*` flow, which is declared
 * outside `RootLayout` and therefore would be missed there.
 */
function PageTracking() {
  usePageTracking();
  return null;
}

/**
 * App-wide metadata fallback, mirroring the static tags in `index.html`.
 * Mounted before any page-level <SEO> so page instances win, and always
 * present so routes without an override keep the default title/description
 * after react-helmet-async takes ownership of the `data-rh` tags.
 */
function DefaultSeo() {
  return <SEO {...defaultMeta} />;
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <PageTracking />
        <DefaultSeo />
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
          <LoginModalProvider>
            <SignupModalProvider>
              <ForgotPasswordModalProvider>
                <WishlistProvider>
                <Suspense fallback={<LoadingScreen />}>
                  <AppRoutes />
                </Suspense>
                  <WishlistCanvas />
                  <LoginModal />
                  <SignupModal />
                  <ForgotPasswordModal />
                  <ReturnFormModal />
                  <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
                </WishlistProvider>
              </ForgotPasswordModalProvider>
            </SignupModalProvider>
          </LoginModalProvider>
        </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
