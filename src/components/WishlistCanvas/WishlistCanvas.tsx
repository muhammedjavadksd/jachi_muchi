import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { getImageUrl } from "../../lib/image";
import type { WishlistItem as WishlistItemType } from "../../types";

/**
 * Slide-over canvas showing wishlist items with remove and view actions
 */
export const WishlistCanvas = memo(function WishlistCanvas(): JSX.Element | null {
  const { items, isOpen, close, removeItem } = useWishlist();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleView = (link: string) => {
    close();
    navigate(link);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[100] transition-opacity"
        onClick={close}
        aria-hidden
      />

      {/* Canvas panel */}
      <div
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl z-[101] flex flex-col animate-[slideInRight_0.25s_ease-out]"
        role="dialog"
        aria-label="Wishlist"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Wishlist</h2>
          <button
            type="button"
            onClick={close}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="Close wishlist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your wishlist is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <WishlistCanvasItem
                  key={item.id}
                  item={item}
                  onRemove={() => removeItem(item.id)}
                  onView={() => handleView(item.link)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
});

WishlistCanvas.displayName = "WishlistCanvas";

const WishlistCanvasItem = memo(function WishlistCanvasItem({
  item,
  onRemove,
  onView,
}: {
  item: WishlistItemType;
  onRemove: () => Promise<void>;
  onView: () => void;
}): JSX.Element {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await onRemove();
    } finally {
      setRemoving(false);
    }
  };

  return (
    <li className="flex gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50">
      <a
        href={item.link}
        onClick={(e) => {
          e.preventDefault();
          onView();
        }}
        className="shrink-0 w-20 h-20 rounded-md overflow-hidden bg-white border border-gray-200"
      >
        <img
          src={getImageUrl(item.image)}
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </a>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
          <p className="text-gray-700 font-semibold mt-0.5">₹{item.price}</p>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onView}
            className="px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            View
          </button>
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="px-3 py-1.5 text-xs font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </li>
  );
});
