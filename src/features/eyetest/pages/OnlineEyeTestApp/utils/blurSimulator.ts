/**
 * Map sphere power (diopters) to CSS blur filter values.
 * The further from 0, the more blurred the letter appears.
 * At exactly the user's power, blur should be minimal (simulated clarity).
 *
 * We use a simple formula: blur = |offset| * 1.5 + 0.3
 * where offset = sliderValue - userPower
 * This gives a minimum blur of 0.3px (slight inherent blur)
 * and increases as the slider moves away from the optimal value.
 */
export function getBlurForPower(
  sliderPower: number
): number {
  const OPTIMAL = 0; // pretend user's perfect correction is 0
  const offset = Math.abs(sliderPower - OPTIMAL);
  return offset * 1.5 + 0.3;
}

/**
 * Generate a random optotype letter for the sphere test.
 */
export function getSphereTestLetter(): string {
  const letters = "EFPTOZLD";
  return letters[Math.floor(Math.random() * letters.length)];
}
