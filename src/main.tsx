import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "@/app/routes";
import { AuthProvider, CartProvider, LoginModalProvider, SignupModalProvider, ForgotPasswordModalProvider, WishlistProvider } from "@/app/providers";
import { WishlistCanvas } from "@/features/wishlist/components/WishlistCanvas/WishlistCanvas";
import { LoginModal } from "@/features/auth/components/LoginModal/LoginModal";
import { SignupModal } from "@/features/auth/components/SignupModal/SignupModal";
import { ForgotPasswordModal } from "@/features/auth/components/ForgotPasswordModal/ForgotPasswordModal";
import { ScrollToTop } from "@/shared/components/ScrollToTop/ScrollToTop";
import { LoadingScreen } from "@/shared/components/LoadingScreen/LoadingScreen";
import { Toaster } from "react-hot-toast";
import "./styles.css";

function AppRoutes() {
  return useRoutes(routes);
}

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
              <Suspense fallback={<LoadingScreen />}>
                <AppRoutes />
              </Suspense>
                <WishlistCanvas />
                <LoginModal />
                <SignupModal />
                <ForgotPasswordModal />
                <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
              </WishlistProvider>
            </ForgotPasswordModalProvider>
          </SignupModalProvider>
        </LoginModalProvider>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
