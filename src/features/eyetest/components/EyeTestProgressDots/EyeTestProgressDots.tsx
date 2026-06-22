import { memo } from "react";

interface EyeTestProgressDotsProps {
  total: number;
  active: number;
}

export const EyeTestProgressDots = memo(function EyeTestProgressDots({ total, active }: EyeTestProgressDotsProps) {
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={active + 1} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            i === active ? "bg-[#05005B]" : "bg-gray-300"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
});

EyeTestProgressDots.displayName = "EyeTestProgressDots";
