import { memo } from "react";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export const ProgressBar = memo(function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  const pct = Math.round((step / totalSteps) * 100);

  return (
    <div className="w-full bg-gray-200 h-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps}>
      <div
        className="h-full bg-[#05005B] transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
});
