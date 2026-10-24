import { memo } from "react";
import type { TransitionOption } from "@/features/lens/types";
import { Price } from "@/shared/components";
/**
 * Transition prices and options are sourced from the hardcoded storefront
 * constants. This must match backend/src/constants/transitions.constant.ts.
 */
import { COLOR_HEX, TRANSITIONS } from "@/constants/transitions";
import {
  TRANSITION_CONTINUE_LABEL,
  TRANSITION_SELECT_COLOR_HINT,
  TRANSITION_SKIP_LABEL,
} from "@/features/checkout/constants";

interface TransitionStepProps {
  selectedTransitionId: string | null;
  selectedColor: string | null;
  onSelectTransition: (transition: TransitionOption) => void;
  onSelectColor: (color: string) => void;
  onContinue: () => void;
  onSkip: () => void;
}

const TRANSITION_ICON = (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.7}
  >
    <circle cx="7" cy="12" r="4" />
    <circle cx="17" cy="12" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 12h2" />
  </svg>
);

export const TransitionStep = memo(function TransitionStep({
  selectedTransitionId,
  selectedColor,
  onSelectTransition,
  onSelectColor,
  onContinue,
  onSkip,
}: TransitionStepProps): JSX.Element {
  const canContinue = Boolean(selectedTransitionId && selectedColor);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4">
        {TRANSITIONS.map((transition) => {
          const isSelected = selectedTransitionId === transition.id;

          return (
            <div key={transition.id}>
              <button
                type="button"
                onClick={() => onSelectTransition(transition)}
                aria-pressed={isSelected}
                className={`w-full flex items-start gap-4 p-4 border rounded-xl transition-all text-left group shadow-md hover:shadow-lg ${
                  isSelected ? "border-teal-600 bg-teal-50" : "border-gray-200"
                } hover:border-teal-600 hover:bg-teal-50`}
              >
                <span
                  className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-teal-600 text-white"
                      : "bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white"
                  }`}
                >
                  {TRANSITION_ICON}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-medium text-gray-900">
                    {transition.name}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-gray-900">
                    <span className="text-sm text-gray-500">+</span>
                    <Price value={transition.price} size="md" />
                  </span>
                </span>
                <span
                  className={`mt-1 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    isSelected ? "border-teal-600 bg-teal-600" : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
              </button>

              {isSelected && (
                <div className="mt-2 rounded-xl border border-teal-100 bg-teal-50/60 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    {TRANSITION_SELECT_COLOR_HINT}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {transition.colors.map((color) => {
                      const isColorSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => onSelectColor(color)}
                          aria-pressed={isColorSelected}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                            isColorSelected
                              ? "border-teal-600 bg-white text-teal-700 ring-2 ring-teal-200"
                              : "border-gray-200 bg-white text-gray-700 hover:border-teal-400"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: COLOR_HEX[color] ?? color }}
                          />
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
        <button
          type="button"
          onClick={onSkip}
          className="w-full sm:flex-1 py-3.5 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          {TRANSITION_SKIP_LABEL}
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full sm:flex-1 py-3.5 px-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {TRANSITION_CONTINUE_LABEL}
        </button>
      </div>
    </div>
  );
});

TransitionStep.displayName = "TransitionStep";
