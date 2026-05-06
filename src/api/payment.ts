import { api } from "./axios";

export const createRazorpayOrder = (amount: number) =>
  api.post("/payment/create-order", { amount });
