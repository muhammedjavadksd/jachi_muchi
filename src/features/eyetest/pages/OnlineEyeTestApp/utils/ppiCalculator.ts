/** Standard credit card dimensions in mm */
export const CREDIT_CARD_W_MM = 85.6;
export const CREDIT_CARD_H_MM = 53.98;

/**
 * Calculate PPI from the rendered pixel width of the credit card outline.
 * Also returns diagonal screen size estimate.
 */
export function calculatePPI(pixelWidth: number): {
  ppi: number;
  pxPerMm: number;
  screenDiagonalInches: number;
} {
  const pxPerMm = pixelWidth / CREDIT_CARD_W_MM;
  const ppi = pxPerMm * 25.4;

  const screenWidthPx = window.screen.width;
  const screenHeightPx = window.screen.height;
  const diagonalPx = Math.sqrt(screenWidthPx ** 2 + screenHeightPx ** 2);
  const screenDiagonalInches = diagonalPx / ppi;

  return { ppi, pxPerMm, screenDiagonalInches };
}

/**
 * Convert mm to pixels using the given PPI.
 */
export function mmToPx(mm: number, ppi: number): number {
  return (mm * ppi) / 25.4;
}

/**
 * Convert pixels to mm.
 */
export function pxToMm(px: number, ppi: number): number {
  return (px * 25.4) / ppi;
}
