import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface ForgotPasswordModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ForgotPasswordModalContext = createContext<ForgotPasswordModalContextValue | null>(null);

export function ForgotPasswordModalProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close }),
    [isOpen, open, close]
  );

  return (
    <ForgotPasswordModalContext.Provider value={value}>
      {children}
    </ForgotPasswordModalContext.Provider>
  );
}

export function useForgotPasswordModal(): ForgotPasswordModalContextValue {
  const ctx = useContext(ForgotPasswordModalContext);
  if (!ctx) throw new Error("useForgotPasswordModal must be used within ForgotPasswordModalProvider");
  return ctx;
}
