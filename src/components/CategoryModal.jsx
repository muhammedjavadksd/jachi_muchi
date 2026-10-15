import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

/**
 * Reusable bottom-sheet modal for a home-page category card.
 *
 * Driven entirely by the `category` object from the categories config
 * (`{ id, label, title, link, options }`) so one instance serves every card.
 * Passing `category = null` closes it with a slide-down animation.
 *
 * `options` (`{ id, label, image }`) render as a 2x2 grid; each tile links to
 * `${category.link}?gender=${option.id}` and "View All" links to `category.link`.
 */
const EXIT_MS = 300;
const DRAG_CLOSE_THRESHOLD = 80;

export function CategoryModal({ category, onClose }) {
  const isOpen = Boolean(category);
  const [active, setActive] = useState(false);
  const [content, setContent] = useState(category);
  const [dragY, setDragY] = useState(0);

  const sheetRef = useRef(null);
  const dragStartRef = useRef(null);

  // Keep the last non-null category so the sheet still has content while it
  // animates closed after `category` becomes null.
  useEffect(() => {
    if (category) setContent(category);
  }, [category]);

  // Flip to the "open" position on the next commit so the closed state paints
  // first and the transform transitions instead of jumping.
  useEffect(() => {
    setActive(isOpen);
  }, [isOpen]);

  // Drop the (still focusable) inner content once the close animation has
  // finished, so its links/buttons cannot be reached by Tab while hidden.
  useEffect(() => {
    if (isOpen) return;
    const timer = setTimeout(() => setContent(null), EXIT_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Scroll lock, Escape-to-close, and moving focus into the dialog on open.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);

    const focusTimer = setTimeout(() => sheetRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  // Keep Tab focus inside the dialog while it is open.
  const handleKeyDown = (event) => {
    if (event.key !== "Tab" || !sheetRef.current) return;
    const focusables = sheetRef.current.querySelectorAll(
      'a[href], button:not([disabled])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Swipe-down-to-close on the handle/header.
  const handleTouchStart = (event) => {
    dragStartRef.current = event.touches[0].clientY;
  };
  const handleTouchMove = (event) => {
    if (dragStartRef.current === null) return;
    const delta = event.touches[0].clientY - dragStartRef.current;
    setDragY(delta > 0 ? delta : 0);
  };
  const handleTouchEnd = () => {
    if (dragY > DRAG_CLOSE_THRESHOLD) onClose();
    setDragY(0);
    dragStartRef.current = null;
  };

  if (typeof document === "undefined") return null;

  const dragging = dragY > 0;
  const sheetTransform = active ? `translateY(${dragY}px)` : "translateY(100%)";

  return createPortal(
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        {/* Always mounted (painted off-screen) so the first open can animate. */}
        <aside
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label={content ? content.title : undefined}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          style={{ transform: sheetTransform }}
          className={`flex max-h-[70vh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[20px] outline-none transition-transform duration-300 ease-out ${
            content ? "bg-white shadow-2xl" : ""
          } ${dragging ? "transition-none" : ""}`}
        >
          {content && (
            <>
              {/* Drag handle + header (swipe target) */}
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: "none" }}
              >
                <div className="flex justify-center pb-1 pt-3">
                  <span className="h-1.5 w-10 rounded-full bg-gray-300" />
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 px-4 pb-3 pt-1">
                  <h2 className="text-sm font-bold text-gray-900">{content.title}</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Options + View All */}
              <div className="overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
                <ul className="grid grid-cols-2 gap-3">
                  {content.options.map((option) => (
                    <li key={option.id}>
                      <Link
                        to={`${content.link}?gender=${option.id}`}
                        onClick={onClose}
                        className="flex flex-col items-center gap-2 rounded-xl bg-gray-100 px-2 py-4 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                      >
                        <img
                          src={option.image}
                          alt=""
                          loading="lazy"
                          className="h-14 w-14 object-contain"
                        />
                        <span className="text-sm font-bold text-gray-900">
                          {option.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  to={content.link}
                  onClick={onClose}
                  className="mt-3 block w-full rounded-xl bg-gray-100 py-3 text-center text-sm font-bold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  View All {content.title}
                </Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>,
    document.body
  );
}

export default CategoryModal;
