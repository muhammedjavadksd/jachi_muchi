import { memo, useState, useRef, useCallback, useEffect } from "react";
import { CreditCard, AlertTriangle } from "lucide-react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";
import { calculatePPI, CREDIT_CARD_W_MM } from "../utils/ppiCalculator";

export const Step03_Calibration = memo(function Step03_Calibration() {
  const { dispatch } = useEyeTest();
  const [widthPx, setWidthPx] = useState(320);
  const [ppi, setPpi] = useState(96);
  const [screenSize, setScreenSize] = useState("--");
  const [skipped, setSkipped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { ppi: calcPpi, screenDiagonalInches } = calculatePPI(widthPx);
    setPpi(Math.round(calcPpi));
    setScreenSize(screenDiagonalInches.toFixed(1));
  }, [widthPx]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = widthPx;
  }, [widthPx]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setDragging(true);
    startXRef.current = e.touches[0].clientX;
    startWidthRef.current = widthPx;
  }, [widthPx]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startXRef.current;
      setWidthPx(Math.max(100, startWidthRef.current + dx));
    };
    const handleTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startXRef.current;
      setWidthPx(Math.max(100, startWidthRef.current + dx));
    };
    const handleUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [dragging]);

  const handleConfirm = () => {
    dispatch({ type: "SET_PPI", payload: { ppi, calibrated: true } });
    dispatch({ type: "SET_STEP", payload: 4 });
  };

  const handleSkip = () => {
    setSkipped(true);
    dispatch({ type: "SET_PPI", payload: { ppi: 96, calibrated: false } });
    dispatch({ type: "SET_STEP", payload: 4 });
  };

  const aspectRatio = CREDIT_CARD_W_MM / 53.98;
  const heightPx = widthPx / aspectRatio;

  return (
    <StepWrapper>
      <div className="flex flex-col items-center max-w-lg mx-auto px-4 py-6 sm:py-8 text-center">
        <div className="w-12 h-12 bg-[#05005B]/10 rounded-xl flex items-center justify-center mb-4">
          <CreditCard size={24} className="text-[#05005B]" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#05005B] mb-2">Screen Calibration</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-sm">
          Place your physical credit card on the screen and resize the outline until it matches perfectly.
        </p>

        {skipped && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left w-full">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">Using default PPI of 96. Test accuracy may be reduced.</p>
          </div>
        )}

        {/* Resizable card */}
        <div className="relative w-full flex items-center justify-center mb-6" style={{ minHeight: 250 }}>
          <div
            ref={cardRef}
            className="border-2 border-dashed border-[#05005B] rounded-lg bg-white/50 flex items-center justify-center select-none"
            style={{ width: widthPx, height: heightPx, maxWidth: "90%" }}
          >
            <span className="text-[#05005B]/30 text-xs font-medium">CREDIT CARD</span>
          </div>

          {/* Resize handle */}
          <div
            className={`absolute bottom-0 right-0 w-8 h-8 bg-[#05005B] rounded-tl-lg cursor-ew-resize flex items-center justify-center translate-x-1/4 translate-y-1/4 ${dragging ? "scale-110" : ""}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ touchAction: "none" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M6 12L12 6M2 8L8 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          Detected screen size: <span className="font-semibold text-[#05005B]">{screenSize} inches approx.</span>
        </div>
        <div className="text-xs text-gray-400 mb-6">PPI: {ppi}</div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button onClick={handleConfirm} className="flex-1 py-3.5 px-6 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg text-sm">
            Looks Good
          </button>
          <button onClick={handleSkip} className="flex-1 py-3.5 px-6 border-2 border-gray-300 text-gray-500 font-semibold rounded-xl hover:border-gray-400 transition-colors text-sm">
            Skip
          </button>
        </div>
      </div>
    </StepWrapper>
  );
});
