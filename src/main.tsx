import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { ROUTES } from "./lib/routeConfig";
import type { RouteConfig } from "./lib/routeConfig";
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
                {ROUTES.map((r: RouteConfig) => (
                  <Route
                    key={r.path}
                    path={r.path}
                    element={
                      r.protected ? (
                        <ProtectedRoute>
                          <r.component />
                        </ProtectedRoute>
                      ) : (
                        <r.component />
                      )
                    }
                  />
                ))}
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
