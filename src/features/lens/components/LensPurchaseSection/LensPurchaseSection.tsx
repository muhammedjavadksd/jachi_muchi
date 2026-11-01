import { memo, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { LensPowerSelector } from "@/features/lens/components/LensPowerSelector/LensPowerSelector";
import { LensPurchaseBar } from "@/features/lens/components/LensPurchaseBar/LensPurchaseBar";
import { LENS_DETAIL_COPY } from "@/features/lens/constants";
import { useLensPowerSelection } from "@/features/lens/hooks/useLensPowerSelection";
import { getLensId } from "@/features/lens/utils/detail";
import { useCart } from "@/features/cart/hooks";
import { useAuthGuard } from "@/shared/hooks";
import type { LensItem } from "@/features/lens/types";

export interface LensPurchaseSectionProps {
  lens: LensItem;
}

export const LensPurchaseSection = memo(function LensPurchaseSection({
  lens,
}: LensPurchaseSectionProps): JSX.Element {
  const {
    fields,
    selectedEyes,
    values,
    isComplete,
    totalMax,
    overLimitEyes,
    powerDetails,
    toggleEye,
    setField,
  } = useLensPowerSelection(lens);
  const { addToCart } = useCart();
  const { requireAuth } = useAuthGuard();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = useCallback(() => {
    if (isAdding || !isComplete) return;

    const lensId = getLensId(lens);
    if (!lensId) {
      toast.error(LENS_DETAIL_COPY.lensUnavailable);
      return;
    }

    const action = async () => {
      setIsAdding(true);
      try {
        await addToCart({
          itemType: "lens",
          quantity: 1,
          lens: {
            id: lensId,
            name: lens.name,
          },
          powerType: "lens",
          powerDetails,
        });
        toast.success(LENS_DETAIL_COPY.addToCartSuccess);
      } catch (error: any) {
        if (import.meta.env.DEV) console.error("Failed to add lens to cart");
        toast.error(LENS_DETAIL_COPY.addToCartError);
      } finally {
        setIsAdding(false);
      }
    };

    void requireAuth(action);
  }, [addToCart, isAdding, isComplete, lens, powerDetails, requireAuth]);

  return (
    <>
      <LensPowerSelector
        fields={fields}
        selectedEyes={selectedEyes}
        values={values}
        onToggleEye={toggleEye}
        onFieldChange={setField}
        totalMax={totalMax}
        overLimitEyes={overLimitEyes}
      />
      <LensPurchaseBar
        isComplete={isComplete}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
      />
    </>
  );
});

LensPurchaseSection.displayName = "LensPurchaseSection";
