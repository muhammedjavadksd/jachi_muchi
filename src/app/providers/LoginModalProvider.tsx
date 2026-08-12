import { createContext, useCallback, useEffect, useMemo, useState } from "react";

interface LoginModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Listen for auth:require-login events dispatched by CartProvider,
  // useWishlist, useAuthGuard — any component that cannot call useLoginModal
  // directly due to provider ordering constraints.
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("auth:require-login", handler);
    return () => window.removeEventListener("auth:require-login", handler);
  }, []);

  const value = useMemo(
    () => ({ isOpen, open, close }),
    [isOpen, open, close]
  );

  return (
    <LoginModalContext.Provider value={value}>
      {children}
    </LoginModalContext.Provider>
  );
}

export { LoginModalContext };
