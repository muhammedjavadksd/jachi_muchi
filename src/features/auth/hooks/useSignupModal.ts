import { useContext } from "react";
import { SignupModalContext } from "@/app/providers/SignupModalProvider";

export function useSignupModal() {
  const context = useContext(SignupModalContext);
  if (!context) throw new Error("useSignupModal must be used within SignupModalProvider");
  return context;
}
