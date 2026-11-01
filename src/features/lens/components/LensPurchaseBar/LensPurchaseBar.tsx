import { memo } from "react";
import { LENS_DETAIL_COPY } from "@/features/lens/constants";

export interface LensPurchaseBarProps {
  isComplete: boolean;
  isAdding: boolean;
  onAddToCart: () => void;
}

const NOTE_ID = "lens-power-note";

export const LensPurchaseBar = memo(function LensPurchaseBar({
  isComplete,
  isAdding,
  onAddToCart,
}: LensPurchaseBarProps): JSX.Element {
  const disabled = !isComplete || isAdding;

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:static md:mt-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none">
      <button
        type="button"
        onClick={onAddToCart}
        disabled={disabled}
        aria-disabled={disabled}
        aria-busy={isAdding}
        aria-describedby={!isComplete ? NOTE_ID : undefined}
        className="w-full bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors enabled:hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
      >
        {LENS_DETAIL_COPY.addToCart}
      </button>
      {!isComplete && (
        <p id={NOTE_ID} className="mt-2 text-center text-xs leading-5 text-gray-500">
          {LENS_DETAIL_COPY.powerIncomplete}
        </p>
      )}
    </div>
  );
});

LensPurchaseBar.displayName = "LensPurchaseBar";
