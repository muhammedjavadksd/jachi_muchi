/**
 * Display helper only. The server decides the fitting fee (charged only when
 * the cart holds both a frame and a lens), so this just sanitises its figure.
 */
export function getEffectiveFittingFee(
  fittingFee: number | string | null | undefined
): number {
  const fee = Number(fittingFee ?? 0);
  return Number.isFinite(fee) && fee > 0 ? fee : 0;
}
