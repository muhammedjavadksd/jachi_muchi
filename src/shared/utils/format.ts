export function formatPrice(value: number): string {
  return Math.round(value).toLocaleString("en-IN");
}
