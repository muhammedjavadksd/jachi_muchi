import { useContext } from "react";
import { ForgotPasswordModalContext } from "@/app/providers/ForgotPasswordModalProvider";

export function useForgotPasswordModal() {
  const context = useContext(ForgotPasswordModalContext);
  if (!context) throw new Error("useForgotPasswordModal must be used within ForgotPasswordModalProvider");
  return context;
}
