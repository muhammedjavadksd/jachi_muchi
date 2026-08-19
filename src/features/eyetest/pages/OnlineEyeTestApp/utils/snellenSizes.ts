/**
 * Snellen lines from largest to smallest.
 * Each entry gives the Snellen fraction and the letter height in mm
 * at the standard testing distance of 40cm (400mm).
 */
export interface SnellenLine {
  label: string;  // e.g. "6/60"
  heightMm: number;
  letters: string;
}

/**
 * Standard Snellen optotype letters for each line.
 */
const LETTER_SETS = [
  "E",    // 6/60
  "FP",   // 6/36
  "PTO",  // 6/24
  "TOZ",  // 6/18
  "LPED", // 6/12
  "PECFD",// 6/9
  "EDFCZP",// 6/6
];

/** Visual angle 5 arc-minutes = 0.001454 rad. At 400mm:
 *  height = 400 * tan(0.001454) ≈ 400 * 0.001454 ≈ 0.5816mm
 *  For 6/6 at 40cm: height = 0.5816mm
 *  Each line doubles / halves proportionally from 6/6.
 */
const BASE_HEIGHT_6_6_MM = 0.5816;

export const SNELLEN_LINES: SnellenLine[] = [
  { label: "6/60", heightMm: BASE_HEIGHT_6_6_MM * 10, letters: LETTER_SETS[0] },
  { label: "6/36", heightMm: BASE_HEIGHT_6_6_MM * 6,  letters: LETTER_SETS[1] },
  { label: "6/24", heightMm: BASE_HEIGHT_6_6_MM * 4,  letters: LETTER_SETS[2] },
  { label: "6/18", heightMm: BASE_HEIGHT_6_6_MM * 3,  letters: LETTER_SETS[3] },
  { label: "6/12", heightMm: BASE_HEIGHT_6_6_MM * 2,  letters: LETTER_SETS[4] },
  { label: "6/9",  heightMm: BASE_HEIGHT_6_6_MM * 1.5,letters: LETTER_SETS[5] },
  { label: "6/6",  heightMm: BASE_HEIGHT_6_6_MM,       letters: LETTER_SETS[6] },
];

/**
 * Get the pixel height for a Snellen line based on the user's PPI.
 *
 * The raw clinical calculation (mm → px via PPI) produces sizes that are
 * far too small for a web-based test where the viewing distance is unknown
 * and the screen is not calibrated. We apply a multiplier so that the
 * largest line (6/60) renders around 120–160 px and the smallest (6/6)
 * around 16–24 px — large enough to be legible while still preserving
 * the correct relative scaling between lines.
 */
const WEB_SCALE_MULTIPLIER = 22;

export function getSnellenPx(lineIndex: number, ppi: number): number {
  const mm = SNELLEN_LINES[lineIndex].heightMm;
  return ((mm * ppi) / 25.4) * WEB_SCALE_MULTIPLIER;
}

/**
 * Pool of distractor letters (not used in SNELLEN_LINES) for the
 * multiple-choice options.
 */
const DISTRACTOR_POOL = ["Z", "L", "D", "C", "H", "N", "R", "S"];

/**
 * Generate a randomized array of 5 multiple-choice options that always
 * includes the correct letter from the current Snellen line.
 *
 * @param correctLetter  The letter the user should identify.
 * @returns              Shuffled array of 5 letters (first element is NOT
 *                       guaranteed to be the correct one).
 */
export function generateOptions(correctLetter: string): string[] {
  const distractors = DISTRACTOR_POOL.filter((l) => l !== correctLetter);
  const shuffled = [...distractors].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 4);
  const options = [correctLetter, ...picked];
  return options.sort(() => Math.random() - 0.5);
}

/**
 * Near vision sizes (N-scale) — text height in mm at 40cm.
 */
export const NEAR_VISION_LINES = [
  { label: "N6",  heightMm: 0.25, text: "The quick brown fox jumps over the lazy dog." },
  { label: "N8",  heightMm: 0.30, text: "Good reading vision. You can read newspapers comfortably." },
  { label: "N10", heightMm: 0.40, text: "Normal reading vision. Most books and documents are readable." },
  { label: "N12", heightMm: 0.50, text: "Slightly reduced near vision. You may need brighter light." },
  { label: "N14", heightMm: 0.65, text: "Mild reading difficulty. Consider reading glasses." },
  { label: "N18", heightMm: 0.85, text: "Moderate reading difficulty. Reading glasses recommended." },
  { label: "N24", heightMm: 1.10, text: "Significant reading difficulty. Strong reading glasses may help." },
];
