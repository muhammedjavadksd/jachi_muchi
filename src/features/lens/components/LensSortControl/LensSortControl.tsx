import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LENS_SORT_OPTIONS } from "@/features/lens/constants";

export interface LensSortControlProps {
  value: string;
  onChange: (value: string) => void;
}

const MENU_ID = "lens-sort-menu";

/**
 * Plain-text sort control for the lens listing. Uses the menu pattern so
 * keyboard users can open with Enter/Space/ArrowDown, move with the arrow
 * keys, jump with Home/End, select with Enter, and dismiss with Escape.
 */
export const LensSortControl = memo(function LensSortControl({
  value,
  onChange,
}: LensSortControlProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex = useMemo(() => {
    const index = LENS_SORT_OPTIONS.findIndex((option) => option.value === value);
    return index >= 0 ? index : 0;
  }, [value]);

  const selectedLabel = LENS_SORT_OPTIONS[selectedIndex].label;

  const focusOption = useCallback((index: number) => {
    const count = LENS_SORT_OPTIONS.length;
    const next = ((index % count) + count) % count;
    optionRefs.current[next]?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    optionRefs.current[selectedIndex]?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, selectedIndex]);

  const handleSelect = useCallback(
    (nextValue: string) => {
      setOpen(false);
      onChange(nextValue);
      triggerRef.current?.focus();
    },
    [onChange]
  );

  const handleMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>) => {
      const currentIndex = optionRefs.current.findIndex(
        (option) => option === document.activeElement
      );

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          focusOption(currentIndex + 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          focusOption(currentIndex - 1);
          break;
        case "Home":
          event.preventDefault();
          focusOption(0);
          break;
        case "End":
          event.preventDefault();
          focusOption(LENS_SORT_OPTIONS.length - 1);
          break;
        case "Escape":
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
          break;
        case "Tab":
          setOpen(false);
          break;
        default:
          break;
      }
    },
    [focusOption]
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={MENU_ID}
        className="flex flex-col items-start gap-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[#b8860b] focus-visible:ring-offset-2 sm:items-end"
      >
        <span className="flex items-center gap-1 text-sm font-medium text-[#1a1a1a]">
          Sort by
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </span>
        <span className="text-xs uppercase tracking-[0.08em] text-gray-500">
          {selectedLabel}
        </span>
      </button>

      {open && (
        <ul
          id={MENU_ID}
          role="menu"
          aria-label="Sort lenses"
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 top-full z-50 mt-2 w-52 border border-[#e8e8e8] bg-white py-1 shadow-lg"
        >
          {LENS_SORT_OPTIONS.map((option, index) => (
            <li key={option.value} role="none">
              <button
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={option.value === value}
                onClick={() => handleSelect(option.value)}
                className={`block w-full px-4 py-2 text-left text-sm outline-none transition-colors focus-visible:bg-gray-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b8860b] ${
                  option.value === value
                    ? "font-semibold text-[#1a1a1a]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

LensSortControl.displayName = "LensSortControl";

