import { CURRENCY_SYMBOL } from "@/shared/constants";

export function formatPrice(value: number): string {
  return Math.round(value).toLocaleString("en-IN");
}

export function formatCurrency(value: number): string {
  return `${CURRENCY_SYMBOL}${formatPrice(value)}`;
}
