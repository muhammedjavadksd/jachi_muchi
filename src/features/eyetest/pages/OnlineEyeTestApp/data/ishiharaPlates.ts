export interface IshiharaPlate {
  image: string;
  correctAnswer: string;
}

/**
 * Ishihara color vision test plates.
 * Replace placeholder SVGs in public/eye-test/ishihara/ with real plate images.
 * Update correctAnswer values to match the actual numbers on your plates.
 */
export const ishiharaPlates: IshiharaPlate[] = [
  { image: "/eye-test/ishihara/plate-1.svg", correctAnswer: "12" },
  { image: "/eye-test/ishihara/plate-2.svg", correctAnswer: "8" },
  { image: "/eye-test/ishihara/plate-3.svg", correctAnswer: "5" },
];
