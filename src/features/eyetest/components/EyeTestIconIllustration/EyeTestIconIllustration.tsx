import { memo } from "react";

export const EyeTestIconIllustration = memo(function EyeTestIconIllustration() {
  return (
    <div className="flex items-center gap-4 sm:gap-6" aria-hidden="true">
      {/* Glasses icon */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[56px] sm:h-[56px]">
        <circle cx="14" cy="27" r="10" stroke="#05005B" strokeWidth="2.5" />
        <circle cx="34" cy="27" r="10" stroke="#05005B" strokeWidth="2.5" />
        <path d="M24 27L28 23" stroke="#05005B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M4 27H2" stroke="#05005B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44 27H46" stroke="#05005B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 19C10 19 12 15 14 15C16 15 18 19 18 19" stroke="#05005B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M30 19C30 19 32 15 34 15C36 15 38 19 38 19" stroke="#05005B" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {/* Slash separator */}
      <svg width="16" height="48" viewBox="0 0 16 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[20px] sm:h-[56px]">
        <line x1="6" y1="4" x2="10" y2="44" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {/* Contact lens icon */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[56px] sm:h-[56px]">
        <ellipse cx="14" cy="27" rx="8" ry="10" stroke="#05005B" strokeWidth="2.5" />
        <ellipse cx="34" cy="27" rx="8" ry="10" stroke="#05005B" strokeWidth="2.5" />
        <circle cx="14" cy="27" r="3" fill="#05005B" />
        <circle cx="34" cy="27" r="3" fill="#05005B" />
        <path d="M4 27H2" stroke="#05005B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44 27H46" stroke="#05005B" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
});

EyeTestIconIllustration.displayName = "EyeTestIconIllustration";
