import { LENS_DETAIL_COPY, LENS_POWER_UI_LIMITS } from "@/features/lens/constants";
import type { LensItem } from "@/features/lens/types";

export interface LensSpec {
  label: string;
  value: string;
}

export interface LensPowerOptions {
  sph: string[];
  cyl: string[];
  add: string[];
  hasSph: boolean;
  hasCyl: boolean;
  hasAdd: boolean;
}

const NONE_VALUE = "None";
const DECIMAL_PLACES = 2;
const EPSILON = 0.0001;

function toFiniteNumber(value: number | null | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatWords(value: string): string {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getLensId(lens: Pick<LensItem, "_id" | "id">): string | undefined {
  return lens._id || lens.id;
}

export function getLensCategoryId(lens: LensItem): string | undefined {
  if (!lens.category) return undefined;
  return typeof lens.category === "string"
    ? lens.category
    : lens.category._id || lens.category.id;
}

/** Combined SPH + CYL limit in diopters (magnitude); undefined when the lens has none. */
export function getLensTotalMax(lens: LensItem): number | undefined {
  const totalMax = toFiniteNumber(lens.power?.totalMax);
  return totalMax !== undefined && totalMax > 0 ? totalMax : undefined;
}

/** True when |SPH + CYL| exceeds totalMax. Empty counts as 0; non-numeric counts as over. */
export function isPowerOverTotalMax(
  sph: string | null | undefined,
  cyl: string | null | undefined,
  totalMax: number | undefined
): boolean {
  if (totalMax === undefined) return false;
  const total = Math.abs(Number(sph || 0) + Number(cyl || 0));
  return Number.isNaN(total) || total > totalMax + EPSILON;
}

export function formatLensValue(value: string): string {
  if (/^\d+(\.\d+)?$/.test(value)) return value;
  return formatWords(value);
}

export function formatDiopter(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  if (Math.abs(rounded) < EPSILON) return "0.00";
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(DECIMAL_PLACES)}`;
}

export function buildLensChips(lens: LensItem): string[] {
  const photochromic =
    lens.photochromic && lens.photochromic !== NONE_VALUE ? lens.photochromic : undefined;
  const xperio =
    lens.xperioType && lens.xperioType !== NONE_VALUE ? lens.xperioType : undefined;

  return [
    lens.type ? formatLensValue(lens.type) : undefined,
    lens.design,
    lens.material ? `Material ${lens.material}` : undefined,
    lens.coating,
    photochromic,
    lens.blueUV ? "Blue UV" : undefined,
    xperio,
    lens.corridor,
    lens.boostAddition ? `Boost +${lens.boostAddition}` : undefined,
  ].filter((chip): chip is string => Boolean(chip && chip.trim()));
}

export function buildLensSpecs(lens: LensItem): LensSpec[] {
  const specs: LensSpec[] = [];
  const category =
    typeof lens.category === "object" && lens.category
      ? lens.category.name
      : undefined;
  const power = lens.power;
  const addition = lens.addition;

  const addSpec = (label: string, value: string | number | null | undefined): void => {
    if (value === null || value === undefined || value === "") return;
    specs.push({ label, value: String(value) });
  };

  addSpec("Brand", lens.brand?.name);
  addSpec("Category", category);
  if (lens.type) addSpec("Lens Type", formatLensValue(lens.type));
  addSpec("Design", lens.design);
  addSpec("Material", lens.material);
  addSpec("Coating", lens.coating);
  addSpec("Blue UV", lens.blueUV ? "Yes" : "No");
  if (lens.photochromic && lens.photochromic !== NONE_VALUE) {
    addSpec("Photochromic", lens.photochromic);
  }
  if (lens.photochromicColors?.length) {
    addSpec("Photochromic Colours", lens.photochromicColors.join(", "));
  }
  if (lens.xperioType && lens.xperioType !== NONE_VALUE) {
    addSpec("Xperio", lens.xperioType);
  }
  addSpec("Corridor", lens.corridor);
  addSpec("Boost Addition", lens.boostAddition ? `+${lens.boostAddition}` : undefined);

  const sphPlus = toFiniteNumber(power?.sphPlus);
  const sphMinus = toFiniteNumber(power?.sphMinus);
  if (sphPlus !== undefined || sphMinus !== undefined) {
    addSpec(
      "SPH Range",
      `${sphMinus !== undefined ? formatDiopter(-Math.abs(sphMinus)) : "0.00"} to ${
        sphPlus !== undefined ? formatDiopter(Math.abs(sphPlus)) : "0.00"
      }`
    );
  }
  const cylMax = toFiniteNumber(power?.cylMax);
  if (cylMax !== undefined) addSpec("CYL Max", formatDiopter(-Math.abs(cylMax)));
  const totalMax = toFiniteNumber(power?.totalMax);
  if (totalMax !== undefined) addSpec("Combined Power Max", formatDiopter(totalMax));

  const additionMin = toFiniteNumber(addition?.min);
  const additionMax = toFiniteNumber(addition?.max);
  if (additionMin !== undefined || additionMax !== undefined) {
    addSpec(
      "Addition Range",
      `${additionMin !== undefined ? formatDiopter(additionMin) : "0.00"} to ${
        additionMax !== undefined ? formatDiopter(additionMax) : "0.00"
      }`
    );
  }

  addSpec("Stock", lens.stockType);
  if (lens.leadTimeDays !== null && lens.leadTimeDays !== undefined) {
    addSpec("Lead Time", `${lens.leadTimeDays} days`);
  }

  return specs;
}

export function buildDeliveryText(lens: LensItem): string {
  const leadTime = toFiniteNumber(lens.leadTimeDays);
  const days = leadTime !== undefined ? Math.max(0, Math.round(leadTime)) : undefined;

  if (days !== undefined && days > 0) {
    const dayLabel = days === 1 ? "day" : "days";
    return lens.stockType === "Special order"
      ? `Special order, ships in ${days} ${dayLabel}`
      : `Ships in ${days} ${dayLabel}`;
  }

  return lens.stockType || LENS_DETAIL_COPY.fallbackDelivery;
}

function buildStepRange(min: number, max: number): number[] {
  const step = LENS_POWER_UI_LIMITS.step;
  if (max < min) return [];
  const steps = Math.floor((max - min) / step + EPSILON);
  return Array.from({ length: steps + 1 }, (_, index) => {
    const value = min + index * step;
    return Math.round(value * 100) / 100;
  });
}

/**
 * Generates quarter-diopter options from the lens's own power/addition ranges.
 * Extreme admin values are bounded to the UI limits to keep the selects usable;
 * every option is still a real step inside the configured range.
 */
export function buildLensPowerOptions(lens: LensItem): LensPowerOptions {
  const sphPlus = clamp(toFiniteNumber(lens.power?.sphPlus) ?? 0, 0, LENS_POWER_UI_LIMITS.sph);
  const sphMinus = clamp(toFiniteNumber(lens.power?.sphMinus) ?? 0, 0, LENS_POWER_UI_LIMITS.sph);
  const cylMax = clamp(toFiniteNumber(lens.power?.cylMax) ?? 0, 0, LENS_POWER_UI_LIMITS.cyl);
  const additionMin = toFiniteNumber(lens.addition?.min);
  const additionMax = toFiniteNumber(lens.addition?.max);

  const hasSph = sphPlus > 0 || sphMinus > 0;
  const sph: string[] = [];

  if (hasSph) {
    const plusValues = buildStepRange(LENS_POWER_UI_LIMITS.step, sphPlus).reverse();
    const minusValues = buildStepRange(LENS_POWER_UI_LIMITS.step, sphMinus);
    sph.push(
      ...plusValues.map(formatDiopter),
      "0.00",
      ...minusValues.map((value) => formatDiopter(-value))
    );
  }

  const hasCyl = cylMax > 0;
  const cyl = hasCyl
    ? ["0.00", ...buildStepRange(LENS_POWER_UI_LIMITS.step, cylMax).map((value) => formatDiopter(-value))]
    : [];

  const hasAdd =
    additionMin !== undefined &&
    additionMax !== undefined &&
    additionMax >= additionMin;
  const add = hasAdd
    ? buildStepRange(
        clamp(additionMin, 0, LENS_POWER_UI_LIMITS.add),
        clamp(additionMax, 0, LENS_POWER_UI_LIMITS.add)
      ).map(formatDiopter)
    : [];

  return { sph, cyl, add, hasSph, hasCyl, hasAdd };
}
