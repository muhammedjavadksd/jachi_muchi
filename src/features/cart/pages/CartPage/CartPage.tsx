import { memo, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "@/components";
import { Container } from "@/shared/components/Container/Container";
import { getImageUrl } from "@/shared/utils/image";
import { formatPrice } from "@/shared/utils/format";
import { useCartPage } from "@/features/cart/hooks";
import { addToWishlistAPI } from "@/features/wishlist/api/wishlistApi";

const PROMOTION_HEADER_HEIGHT = 140;

export const CartPage = memo(function CartPage(): JSX.Element {
  const {
    cartItems,
    displayBill,
    totalQuantity,
    comboOffers,
    activeCombos,
    incompleteCombos,
    getOfferBadge,
    getComboSavingsForOffer,
    updatingItems,
    stockErrors,
    handleRemoveItem,
    handleUpdateQuantity,
  } = useCartPage();

  const [pendingRemoval, setPendingRemoval] = useState<{ cartItemId: string; productId: string; productName: string; productPrice: number; productImage?: string } | null>(null);

  const handleMoveToWishlist = useCallback(async () => {
    if (!pendingRemoval) return;
    try {
      await addToWishlistAPI({
        productId: pendingRemoval.productId,
        name: pendingRemoval.productName,
        image: pendingRemoval.productImage || "",
        link: `/product/${pendingRemoval.productId}`,
        price: pendingRemoval.productPrice,
      });
      await handleRemoveItem(pendingRemoval.cartItemId);
    } catch {
      // failed — silently ignore
    } finally {
      setPendingRemoval(null);
    }
  }, [pendingRemoval, handleRemoveItem]);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const cartItemsList = useMemo(() =>
    cartItems.map((item, index) => {
      const offerBadge = getOfferBadge(item.productId, item.productPrice);
      const isFreeOffer = !!item.isFreeOfferItem;
      const isSameProductBogo = (item.freeCount || 0) > 0 && !isFreeOffer;

      return (
      <div
        key={item.cartItemId || `${item.productId}-${index}`}
        className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:w-40 h-40 sm:h-32 bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 relative">
            {isFreeOffer ? (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-600 text-white text-[9px] font-bold shadow-md z-10">
                FREE
              </div>
            ) : offerBadge && (
              <div
                className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-white text-[9px] font-bold shadow-md z-10"
                style={{ backgroundColor: offerBadge.color }}
              >
                {offerBadge.label}
              </div>
            )}
            <img
              src={getImageUrl(item.productImage)}
              alt={item.productName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-base font-medium text-gray-900 leading-snug pr-2 line-clamp-2">
                {item.productName}
              </h3>
              <div className="text-right shrink-0">
                {isFreeOffer ? (
                  <div className="flex flex-col items-end gap-0.5">
                    {item.mrp && <span className="text-gray-400 line-through text-sm">₹{formatPrice(item.mrp)}</span>}
                    <span className="font-bold text-green-600 text-lg">FREE</span>
                  </div>
                ) : item.mrp && item.mrp > item.productPrice && (
                  <span className="text-gray-400 line-through text-sm">₹{formatPrice(item.mrp)}</span>
                )}
              </div>
            </div>

            {isFreeOffer && item.triggerProductName && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 border border-green-200">
                <svg className="w-3 h-3 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 text-xs font-medium">Free with {item.triggerProductName}</span>
              </div>
            )}

            {item.color && (
              <div className="flex items-center gap-2 mt-2">
                <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: item.color.name }} />
                <span className="text-gray-600 text-sm">Color: {item.color.name}</span>
              </div>
            )}

            {item.lens && (
              <div className="flex justify-between items-center my-3">
                <span className="text-gray-600 text-sm">Lens: {item.lens.name}{item.lens.price > 0 ? ` (+₹${formatPrice(item.lens.price)})` : ''}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-3 border-t border-gray-100">
              <span className="text-gray-700 font-medium">Final Price</span>
              <div className="text-right">
                {isFreeOffer ? (
                  <span className="font-bold text-green-600 text-xl">₹0</span>
                ) : isSameProductBogo ? (
                  <span className="font-bold text-gray-900 text-xl">₹{formatPrice((item.setCount || 1) * item.productPrice + (item.lens?.price || 0))}</span>
                ) : (
                  <span className="font-bold text-gray-900 text-xl">₹{formatPrice(item.productPrice + (item.lens?.price || 0))}</span>
                )}
              </div>
            </div>

            {isFreeOffer && (
              <div className="pt-2">
                <Link
                  to={`/product/${item.productId}`}
                  className="block w-full py-2.5 text-center text-sm font-medium text-teal-700 border border-teal-200 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  View Product
                </Link>
              </div>
            )}

            {!isFreeOffer && item.cartItemId && (
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <span className="text-gray-700 font-medium text-sm">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.cartItemId!, "decrement")}
                    disabled={updatingItems[item.cartItemId!] || (item.setCount || 1) <= 1}
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-700 hover:border-teal-600 hover:text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center font-semibold text-gray-900">
                      {item.setCount || 1}
                    </span>
                    {isSameProductBogo && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold leading-none whitespace-nowrap">
                        +1 FREE
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleUpdateQuantity(item.cartItemId!, "increment")}
                    disabled={updatingItems[item.cartItemId!]}
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-700 hover:border-teal-600 hover:text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            {item.cartItemId && stockErrors[item.cartItemId!] && (
              <p className="text-red-600 text-xs mt-1">{stockErrors[item.cartItemId!]}</p>
            )}

            {!isFreeOffer && item.cartItemId && (
              <div className="flex items-center text-sm pt-2">
                <button
                  onClick={() => setPendingRemoval({
                    cartItemId: item.cartItemId!,
                    productId: item.productId,
                    productName: item.productName,
                    productPrice: item.productPrice,
                    productImage: item.productImage,
                  })}
                  className="text-red-600 font-medium hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      );
    })
  , [cartItems, getOfferBadge, updatingItems, stockErrors, handleRemoveItem, handleUpdateQuantity]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-6 md:py-10">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 px-1">
                Cart ({totalQuantity} items)
              </h1>

              {cartItemsList}

              {cartItems.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                  Your cart is empty
                </div>
              )}
            </div>

            {comboOffers.length > 0 && (
              <div className="mb-6 space-y-3">
                {activeCombos.map((c) => {
                  const displaySavings = c.discount > 0 ? c.discount : getComboSavingsForOffer(c.offer);
                  return (
                  <div key={c.offer._id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0">C</div>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">{c.offer.offerName}</p>
                      <p className="text-xs text-amber-700">Combo active! Save ₹{formatPrice(displaySavings)} on this bundle</p>
                    </div>
                  </div>
                  );
                })}
                {incompleteCombos.map((c) => (
                  <div key={c.offer._id} className="p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">C</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.offer.offerName}</p>
                      <p className="text-xs text-gray-500">
                        Add {c.missingProducts.length > 1 ? "all products" : "the missing product"} to get combo discount
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="lg:w-96 lg:shrink-0">
              <div className="lg:sticky lg:top-[180px]">
                <h2 className="text-2xl font-semibold text-gray-900 mb-5 px-1">Bill Details</h2>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6 shadow-sm">
                  <div className="space-y-4">
                    {displayBill ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total item price</span>
                          <span>₹{formatPrice(displayBill.totalItemPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total discount</span>
                          {displayBill.totalDiscount > 0 ? (
                            <span className="text-green-600">-₹{formatPrice(displayBill.totalDiscount)}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Offer savings</span>
                          {displayBill.offerSavings > 0 ? (
                            <span className="text-green-600">-₹{formatPrice(displayBill.offerSavings)}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Fitting Fee</span>
                          {displayBill.fittingFee > 0 ? (
                            <span>₹{formatPrice(displayBill.fittingFee)}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                        <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                          <span className="font-semibold text-lg">Total payable</span>
                          <span className="font-bold text-2xl text-gray-900">
                            ₹{formatPrice(displayBill.totalPayable)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-2">Calculating...</p>
                    )}
                  </div>
                </div>

                {cartItems.length > 0 ? (
                  <Link
                    to="/checkout"
                    className="block w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-2xl text-center text-base transition-all active:scale-[0.985]"
                  >
                    Proceed To Checkout →
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full py-4 bg-gray-300 text-gray-500 font-semibold rounded-2xl text-center text-base cursor-not-allowed"
                  >
                    Proceed To Checkout →
                  </button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>

      {pendingRemoval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setPendingRemoval(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 z-10">
            <button
              onClick={() => setPendingRemoval(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-semibold text-gray-900 pr-6">Remove Item From Cart?</h3>
            <p className="text-sm text-gray-500 mt-2">Instead, you could wishlist this item and access it later.</p>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleMoveToWishlist}
                className="w-full py-3 px-4 border border-teal-700 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors"
              >
                Move to wishlist
              </button>
              <button
                onClick={async () => {
                  if (pendingRemoval) {
                    await handleRemoveItem(pendingRemoval.cartItemId);
                  }
                  setPendingRemoval(null);
                }}
                className="w-full py-3 px-4 bg-teal-700 text-white font-semibold rounded-xl hover:bg-teal-800 transition-colors"
              >
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

CartPage.displayName = "CartPage";
