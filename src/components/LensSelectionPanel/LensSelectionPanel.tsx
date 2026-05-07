import { memo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLenses } from "../../api/lens";
import type { LensItem } from "../../api/lens";

type PowerType = "with-power" | "zero-power" | "progressive" | "frame-only";

const LENS_TYPE_MAP: Record<PowerType, string> = {
  "with-power": "with_power",
  "zero-power": "zero_power",
  "progressive": "progressive",
  "frame-only": "frame_only",
};

interface LensSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productPrice: number;
  productMrp: number;
  selectedColor?: { name: string; id: string };
}

export const LensSelectionPanel = memo(function LensSelectionPanel({
  isOpen,
  onClose,
  productId,
  productName,
  productPrice,
  productMrp,
  selectedColor,
}: LensSelectionPanelProps): JSX.Element | null {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPowerType, setSelectedPowerType] = useState<PowerType | null>(null);
  const [selectedLens, setSelectedLens] = useState<LensItem | null>(null);
  const [lenses, setLenses] = useState<LensItem[]>([]);
  const [lensLoading, setLensLoading] = useState(false);
  const [samePowerBothEyes, setSamePowerBothEyes] = useState(false);
  const [hasCylindrical, setHasCylindrical] = useState(false);
  const [powerDetails, setPowerDetails] = useState({
    leftSph: "",
    rightSph: "",
    leftCyl: "",
    rightCyl: "",
    leftAxis: "",
    rightAxis: "",
    name: "",
    phone: "",
    knowPowerLater: false,
  });

  useEffect(() => {
    if (!selectedPowerType || selectedPowerType === "frame-only") return;

    const fetchLenses = async () => {
      try {
        setLensLoading(true);
        const apiType = LENS_TYPE_MAP[selectedPowerType];
        const result = await getLenses(apiType);
        setLenses(result);
      } catch (error) {
        console.error("Failed to fetch lenses:", error);
        setLenses([]);
      } finally {
        setLensLoading(false);
      }
    };

    fetchLenses();
  }, [selectedPowerType]);

  const handlePowerTypeSelect = useCallback((type: PowerType) => {
    setSelectedPowerType(type);
    if (type === "frame-only") {
      setStep(4);
    } else {
      setStep(2);
    }
  }, []);

  const handleLensSelect = useCallback((lens: LensItem) => {
    setSelectedLens(lens);
    if (selectedPowerType === "zero-power") {
      setStep(4);
    } else {
      setStep(3);
    }
  }, [selectedPowerType]);

  const handleBack = useCallback(() => {
    if (step === 1) {
      onClose();
    } else if (step === 2) {
      setStep(1);
      setSelectedPowerType(null);
      setLenses([]);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      if (selectedPowerType === "frame-only") {
        setStep(1);
        setSelectedPowerType(null);
      } else if (selectedPowerType === "zero-power") {
        setStep(2);
      } else {
        setStep(3);
      }
    }
  }, [step, selectedPowerType, onClose]);

  const handleAddToCart = useCallback(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const cartItem = {
      productId,
      productName,
      productPrice,
      mrp: productMrp,
      color: selectedColor || null,
      lens: selectedLens
        ? {
          id: selectedLens._id,
          name: selectedLens.name,
          price: selectedLens.price,
        }
        : null,

      powerType: selectedPowerType,

      powerDetails:
        selectedPowerType === "with-power" || selectedPowerType === "progressive"
          ? {
            leftSPH: powerDetails.leftSph,
            rightSPH: samePowerBothEyes
              ? powerDetails.leftSph
              : powerDetails.rightSph,

            leftCYL: hasCylindrical ? powerDetails.leftCyl : null,
            rightCYL: hasCylindrical
              ? samePowerBothEyes
                ? powerDetails.leftCyl
                : powerDetails.rightCyl
              : null,

            isSamePower: samePowerBothEyes,
            hasCylindrical,
            customerName: powerDetails.name,
            customerPhone: powerDetails.phone,
            knowPowerLater: powerDetails.knowPowerLater,
          }
          : null,

      totalPrice:
        productPrice + (selectedLens?.price || 0),
    };

    cart.push(cartItem);

    localStorage.setItem("cart", JSON.stringify(cart));

    onClose();
    navigate("/cart");
  }, [
    productId,
    productName,
    productPrice,
    selectedPowerType,
    selectedLens,
    powerDetails,
    samePowerBothEyes,
    hasCylindrical,
    selectedColor,
    navigate,
    onClose,
  ]);

  const completedSteps = step - 1;

  const renderStep1 = () => (
    <div className="flex flex-col gap-4">
      <button onClick={() => handlePowerTypeSelect("with-power")} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-left group shadow-md hover:shadow-lg">
        <img src="/category/image.png" alt="With Power" className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">With Power</p>
          <p className="text-sm text-gray-500">Positive, Negative or Cylindrical</p>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      <button onClick={() => handlePowerTypeSelect("zero-power")} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-left group shadow-md hover:shadow-lg">
        <img src="/category/image.png" alt="Zero Power" className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">Zero Power</p>
          <p className="text-sm text-gray-500">BLU Screen lenses (Blue light protection)</p>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      <button onClick={() => handlePowerTypeSelect("progressive")} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-left group shadow-md hover:shadow-lg">
        <img src="/category/image.png" alt="Progressive" className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">Progressive/Bifocals</p>
          <p className="text-sm text-gray-500">Two powers in one eye</p>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      <button onClick={() => handlePowerTypeSelect("frame-only")} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-left group shadow-md hover:shadow-lg">
        <img src="/category/image.png" alt="Frame Only" className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">Frame Only</p>
          <p className="text-sm text-gray-500">With no lenses</p>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );

  const renderStep2 = () => {
    if (lensLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading lenses...</p>
        </div>
      );
    }

    if (lenses.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No lenses available for this type
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {lenses.map((lens) => (
          <button key={lens._id || lens.id || lens.name} onClick={() => handleLensSelect(lens)} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-left group shadow-md hover:shadow-lg">
            <img src="/category/image.png" alt={lens.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-900">{lens.name}</p>
                {lens.badge && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{lens.badge}</span>}
              </div>
              {lens.features && <div className="flex flex-wrap gap-1 mb-2">{lens.features.slice(0, 3).map((f, i) => <span key={i} className="text-xs text-gray-500">{f}</span>)}</div>}
              <div className="flex items-center gap-2">
                {lens.originalPrice && <span className="text-sm text-gray-400 line-through">₹{lens.originalPrice}</span>}
                <span className="font-semibold text-gray-900">₹{lens.price}</span>
                {lens.discount && <span className="text-xs text-green-600 font-medium">{lens.discount}% OFF</span>}
              </div>
              {lens.warranty && <p className="text-xs text-gray-400 mt-1">{lens.warranty} warranty</p>}
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600 mt-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        ))}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="flex flex-col">
      <button onClick={() => setPowerDetails({ ...powerDetails, knowPowerLater: true })} className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-center">
        <p className="font-medium text-gray-900 mb-1">I don't know my power</p>
        <p className="text-sm text-gray-500">Submit Power Later in 15 days after placing the order</p>
      </button>
      <div className="border-t border-gray-200 my-4" />
      <label className="flex items-center gap-2 mb-4"><input type="checkbox" checked={samePowerBothEyes} onChange={(e) => setSamePowerBothEyes(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" /><span className="text-sm text-gray-700">I have same power for both eyes</span></label>
      <label className="flex items-center gap-2 mb-4"><input type="checkbox" checked={hasCylindrical} onChange={(e) => setHasCylindrical(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" /><span className="text-sm text-gray-700">I have cylindrical power</span></label>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div><p className="text-sm font-medium text-gray-700 mb-2">LEFT (OS)</p><select value={powerDetails.leftSph} onChange={(e) => setPowerDetails({ ...powerDetails, leftSph: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg"><option value="">Select SPH</option>{Array.from({ length: 41 }, (_, i) => (i - 20) * 0.25).map((v) => <option key={v} value={v}>{v <= 0 ? v : `+${v}`}</option>)}</select></div>
        <div><p className="text-sm font-medium text-gray-700 mb-2">RIGHT (OD)</p><select value={powerDetails.rightSph} onChange={(e) => setPowerDetails({ ...powerDetails, rightSph: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg"><option value="">Select SPH</option>{Array.from({ length: 41 }, (_, i) => (i - 20) * 0.25).map((v) => <option key={v} value={v}>{v <= 0 ? v : `+${v}`}</option>)}</select></div>
      </div>
      {hasCylindrical && <div className="grid grid-cols-2 gap-4 mb-4"><div><p className="text-sm font-medium text-gray-700 mb-2">LEFT CYL</p><select value={powerDetails.leftCyl} onChange={(e) => setPowerDetails({ ...powerDetails, leftCyl: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg"><option value="">Select CYL</option>{Array.from({ length: 21 }, (_, i) => (i - 10) * 0.25).map((v) => <option key={v} value={v}>{v}</option>)}</select></div><div><p className="text-sm font-medium text-gray-700 mb-2">RIGHT CYL</p><select value={powerDetails.rightCyl} onChange={(e) => setPowerDetails({ ...powerDetails, rightCyl: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg"><option value="">Select CYL</option>{Array.from({ length: 21 }, (_, i) => (i - 10) * 0.25).map((v) => <option key={v} value={v}>{v}</option>)}</select></div></div>}
      <input type="text" placeholder="Name (required)" value={powerDetails.name} onChange={(e) => setPowerDetails({ ...powerDetails, name: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg mb-3" />
      <input type="tel" placeholder="Phone Number (required)" value={powerDetails.phone} onChange={(e) => setPowerDetails({ ...powerDetails, phone: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg mb-4" />
      <p className="text-sm text-gray-500 text-center">Can't find your power? Call <span className="font-medium text-teal-600">+91 8470007367</span></p>
      <button onClick={handleAddToCart} disabled={
        selectedPowerType !== "frame-only" &&
        selectedPowerType !== "zero-power" &&
        (!powerDetails.name ||
          !powerDetails.phone ||
          (!powerDetails.knowPowerLater && !powerDetails.leftSph))
      } className="w-full mt-4 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">Save & Proceed</button>
    </div>
  );

  const renderStep4 = () => {
    const lensPrice = selectedLens?.price || 0;
    const totalPrice = productPrice + lensPrice;
    return (
      <div className="flex flex-col">
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-4 mb-3"><img src="/category/image.png" alt="Product" className="w-16 h-16 rounded-lg object-cover" /><div><p className="font-medium text-gray-900">{productName}</p><p className="text-sm text-gray-500">₹{productPrice}</p></div></div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Lens Type</span><span className="text-gray-900 font-medium">{selectedPowerType === "with-power" ? "With Power" : selectedPowerType === "zero-power" ? "Zero Power" : selectedPowerType === "progressive" ? "Progressive" : "Frame Only"}</span></div>
            {selectedLens && <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Lens</span><span className="text-gray-900 font-medium">{selectedLens.name} (+₹{selectedLens.price})</span></div>}
            <div className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t border-gray-200"><span>Total</span><span>₹{totalPrice}</span></div>
          </div>
        </div>
        <button onClick={handleAddToCart} className="w-full py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors">Add to Cart - ₹{totalPrice}</button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex items-center justify-between">
            {(["Power Type", "Lens", "Add Power"] as const).map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isCompleted = completedSteps >= stepNum;
              const isZeroPowerSkip = selectedPowerType === "zero-power" && stepNum === 3;
              if (isZeroPowerSkip) return null;
              const isVisible = selectedPowerType !== "frame-only" || stepNum === 1;
              if (!isVisible) return null;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className={`flex flex-col items-center ${idx > 0 ? "flex-1" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCompleted ? "bg-teal-600 text-white" : isActive ? "bg-teal-100 text-teal-700 border-2 border-teal-600" : "bg-gray-100 text-gray-400"}`}>
                      {isCompleted ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : stepNum}
                    </div>
                    <span className={`text-xs mt-1 ${isActive ? "text-teal-700 font-medium" : isCompleted ? "text-teal-600" : "text-gray-400"}`}>{label}</span>
                  </div>
                  {idx < 2 && idx < (selectedPowerType !== "frame-only" ? 2 : 0) && <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-teal-600" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{step === 1 ? "Select Lens Type" : step === 2 ? "Choose Lens Package" : step === 3 ? "Enter Power Details" : "Confirm Selection"}</h2>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </>
  );
});

LensSelectionPanel.displayName = "LensSelectionPanel";