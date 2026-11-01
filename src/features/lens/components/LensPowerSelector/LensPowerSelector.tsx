import { memo } from "react";
import { LENS_DETAIL_COPY } from "@/features/lens/constants";
import type {
  LensEye,
  LensEyeValues,
  LensPowerField,
  LensPowerFieldConfig,
} from "@/features/lens/types";

export interface LensPowerSelectorProps {
  fields: LensPowerFieldConfig[];
  selectedEyes: Record<LensEye, boolean>;
  values: Record<LensEye, LensEyeValues>;
  onToggleEye: (eye: LensEye) => void;
  onFieldChange: (eye: LensEye, field: LensPowerField, value: string) => void;
  totalMax?: number;
  overLimitEyes?: LensEye[];
}

const EYES: readonly LensEye[] = ["right", "left"];

const SELECT_CLASSES =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#b8860b] focus:ring-2 focus:ring-[#b8860b]/20";

function eyeLabel(eye: LensEye): string {
  return eye === "right" ? LENS_DETAIL_COPY.rightEye : LENS_DETAIL_COPY.leftEye;
}

export const LensPowerSelector = memo(function LensPowerSelector({
  fields,
  selectedEyes,
  values,
  onToggleEye,
  onFieldChange,
  totalMax,
  overLimitEyes = [],
}: LensPowerSelectorProps): JSX.Element | null {
  if (fields.length === 0) return null;

  const hasSelectedEye = EYES.some((eye) => selectedEyes[eye]);
  const gridClasses =
    fields.length === 1
      ? "grid-cols-1"
      : fields.length === 2
        ? "grid-cols-2"
        : "grid-cols-2 sm:grid-cols-3";

  return (
    <section
      aria-labelledby="lens-power-title"
      className="mt-6 rounded-2xl bg-[#f6f6f6] p-4 md:p-5"
    >
      <h2 id="lens-power-title" className="text-base font-semibold text-[#1a1a1a]">
        {LENS_DETAIL_COPY.powerTitle}
      </h2>

      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {EYES.map((eye) => (
            <label
              key={eye}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            >
              <input
                type="checkbox"
                checked={selectedEyes[eye]}
                onChange={() => onToggleEye(eye)}
                className="h-4 w-4 accent-black"
              />
              <span className="text-xs font-medium text-gray-700">{eyeLabel(eye)}</span>
            </label>
          ))}
        </div>

        {EYES.map((eye) => {
          if (!selectedEyes[eye]) return null;
          return (
            <div key={eye} className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500">
                {eyeLabel(eye)}
              </p>
              <div className={`grid gap-2 ${gridClasses}`}>
                {fields.map((field) => (
                  <label key={field.key} className="block">
                    <span className="mb-1 block text-[11px] font-medium text-gray-500">
                      {field.label}
                    </span>
                    <select
                      value={values[eye][field.key]}
                      onChange={(event) =>
                        onFieldChange(eye, field.key, event.target.value)
                      }
                      className={SELECT_CLASSES}
                      aria-label={`${eyeLabel(eye)} ${field.label}`}
                    >
                      <option value="">{LENS_DETAIL_COPY.selectOption}</option>
                      {field.values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              {totalMax !== undefined && overLimitEyes.includes(eye) && (
                <p role="alert" className="mt-2 text-xs text-red-600">
                  {LENS_DETAIL_COPY.powerTotalExceeded} {totalMax.toFixed(2)}
                </p>
              )}
            </div>
          );
        })}

        {!hasSelectedEye && (
          <p className="text-sm text-gray-500" role="status">
            {LENS_DETAIL_COPY.selectEye}
          </p>
        )}

        <p className="text-xs text-gray-400">{LENS_DETAIL_COPY.powerStepNote}</p>
      </div>
    </section>
  );
});

LensPowerSelector.displayName = "LensPowerSelector";
