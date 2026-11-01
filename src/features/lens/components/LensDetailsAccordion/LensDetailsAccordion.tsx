import { memo, useId, useState } from "react";
import { LENS_DETAIL_COPY } from "@/features/lens/constants";
import type { LensSpec } from "@/features/lens/utils/detail";

export interface LensDetailsAccordionProps {
  description?: string | null;
  specs: LensSpec[];
}

export const LensDetailsAccordion = memo(function LensDetailsAccordion({
  description,
  specs,
}: LensDetailsAccordionProps): JSX.Element | null {
  const [open, setOpen] = useState(true);
  const panelId = useId();
  const hasDescription = Boolean(description?.trim());
  const hasContent = hasDescription || specs.length > 0;

  if (!hasContent) return null;

  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b8860b]"
      >
        <span className="text-base font-semibold text-[#1a1a1a]">
          {LENS_DETAIL_COPY.detailsTitle}
        </span>
        <svg
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div id={panelId} className="border-t border-gray-100 px-4 pb-4 pt-3">
          {hasDescription && (
            <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
              {description}
            </p>
          )}

          {specs.length > 0 && (
            <dl className="mt-3 divide-y divide-gray-100">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 py-2.5"
                >
                  <dt className="text-sm text-gray-500">{spec.label}</dt>
                  <dd className="break-words text-right text-sm font-medium text-gray-900">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
    </section>
  );
});

LensDetailsAccordion.displayName = "LensDetailsAccordion";
