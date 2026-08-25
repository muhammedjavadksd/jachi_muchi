import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "@/components";
import { Container, Price } from "@/shared/components";
import { getImageUrl } from "@/shared/utils/image";
import { useWishlist } from "@/features/wishlist/hooks";

const PROMOTION_HEADER_HEIGHT = 140;

export const WishlistPage = memo(function WishlistPage(): JSX.Element {
  const { items, removeItem, loading } = useWishlist();

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-6 md:py-10">
        <Container>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
            Wishlist ({items.length} items)
          </h1>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading wishlist...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>Your wishlist is empty</p>
              <Link
                to="/"
                className="mt-4 inline-block px-6 py-3 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col"
                >
                  <Link
                    to={item.link}
                    className="w-full h-40 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 mb-4"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <p className="font-medium text-gray-900 text-sm truncate mb-1">{item.name}</p>
                  <Price value={item.price} size="md" className="mb-4" />
                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={item.link}
                      className="flex-1 px-4 py-2.5 text-sm font-medium bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-all text-center"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="px-4 py-2.5 text-sm font-medium bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

WishlistPage.displayName = "WishlistPage";

