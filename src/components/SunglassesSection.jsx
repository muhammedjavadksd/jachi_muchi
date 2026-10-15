import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CategoryModal } from "@/components/CategoryModal";
import { useMediaQuery } from "@/shared/hooks";

/**
 * Home-page "shop by category" tile row.
 *
 * One data-driven config drives both the four cards and the bottom-sheet modal
 * each card opens. Edit `genderOptions` / `categoryCards` to change labels,
 * images, links and modal copy without touching the JSX.
 *
 * Tapping a card opens a single reusable <CategoryModal>; choosing an option
 * navigates to the category listing filtered by gender
 * (`/search/<category>?gender=<gender>`, the app's real filter format).
 *
 * Mobile-only: the entire section (cards + modal) renders only below the 768px
 * `md` breakpoint. On desktop it returns `null` so nothing is mounted and the
 * page flows straight from the hero to "Top Categories" with no gap.
 */
const genderOptions = [
  { id: "men", label: "Men", image: "/category/professional.png" },
  { id: "women", label: "Women", image: "/category/adult.png" },
  { id: "kids", label: "Kids", image: "/category/kids.png" },
  { id: "unisex", label: "Unisex", image: "/category/unisex.png" },
];

const categoryCards = [
  { id: "eyeglasses", label: "Eyeglasses", title: "Eyeglasses", image: "/banner/eyeglass.webp", link: "/search/eyeglasses", options: genderOptions },
  { id: "screen-glasses", label: "Screen Glasses", title: "Screen Glasses", image: "/banner/cumputerglass.webp", link: "/search/screen-glasses", options: genderOptions },
  { id: "sunglasses", label: "Sunglasses", title: "Sunglasses", image: "/banner/sunglass.webp", link: "/search/sunglasses", options: genderOptions },
  { id: "contact-lenses", label: "Contact Lenses", title: "Contact Lenses", image: "/banner/lense.webp", link: "/search/contact-lenses", options: genderOptions },
];

/** Shared focus-visible treatment so every control is keyboard-visible. */
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function CategoryCard({ category, onOpen }) {
  const [imageFailed, setImageFailed] = useState(false);
  const isContactLenses = category.id === "contact-lenses";

  return (
    <li className="min-w-0">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={(event) => onOpen(category, event.currentTarget)}
        className={`group block w-full ${focusRing}`}
      >
        <div className={`aspect-square w-full overflow-hidden rounded-xl border border-gray-100 ${isContactLenses ? "bg-white" : "bg-gray-100"}`}>
          {imageFailed ? (
            <div className="h-full w-full bg-gray-200" />
          ) : (
            <img
              src={category.image}
              alt={category.label}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className={`w-full h-full ${isContactLenses ? "object-cover object-[50%_15%] scale-110 mix-blend-multiply" : "object-cover object-center scale-110"}`}
            />
          )}
        </div>

        <span className="mt-2 block text-center text-xs leading-tight text-gray-700 min-h-[2rem] flex items-start justify-center">
          {category.label}
        </span>
      </button>
    </li>
  );
}

export function SunglassesSection() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [selectedId, setSelectedId] = useState(null);
  const triggerRef = useRef(null);

  // The whole section (cards + modal) is mobile-only. If the viewport grows to
  // desktop while a sheet is open, reset it so resizing back down does not
  // resurrect a stale modal or leave the body scroll lock behind.
  useEffect(() => {
    if (!isMobile) setSelectedId(null);
  }, [isMobile]);

  const selectedCategory = useMemo(
    () => categoryCards.find((category) => category.id === selectedId) || null,
    [selectedId]
  );

  const handleOpen = useCallback((category, element) => {
    triggerRef.current = element;
    setSelectedId(category.id);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
    triggerRef.current?.focus?.();
  }, []);

  if (!isMobile) return null;

  return (
    <section className="px-[4vw] py-6">
      <nav aria-label="Shop by category">
        <ul className="grid grid-cols-4 gap-3">
          {categoryCards.map((category) => (
            <CategoryCard key={category.id} category={category} onOpen={handleOpen} />
          ))}
        </ul>
      </nav>

      <CategoryModal category={selectedCategory} onClose={handleClose} />
    </section>
  );
}

export default SunglassesSection;
