import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface SignupModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const SignupModalContext = createContext<SignupModalContextValue | null>(null);

export function SignupModalProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close }),
    [isOpen, open, close]
  );

  return (
    <SignupModalContext.Provider value={value}>
      {children}
    </SignupModalContext.Provider>
  );
}

export function useSignupModal(): SignupModalContextValue {
  const ctx = useContext(SignupModalContext);
  if (!ctx) throw new Error("useSignupModal must be used within SignupModalProvider");
  return ctx;
}
