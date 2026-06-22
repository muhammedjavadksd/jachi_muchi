import { memo, useRef, useEffect, useState, useCallback } from "react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";

export const Step08_AstigmatismLeft = memo(function Step08_AstigmatismLeft() {
  const { dispatch } = useEyeTest();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [allEqual, setAllEqual] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.clientWidth, canvas.clientHeight, 280);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;

    ctx.clearRect(0, 0, size, size);

    for (let deg = 0; deg < 360; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      const x1 = cx + Math.cos(rad) * r * 0.2;
      const y1 = cy + Math.sin(rad) * r * 0.2;
      const x2 = cx + Math.cos(rad) * r;
      const y2 = cy + Math.sin(rad) * r;

      const variation = Math.sin(deg * 0.3 + 1) * 0.5 + 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#1a2a3a";
      ctx.lineWidth = 1.2 * variation;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "#1a2a3a";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, []);

  const handleAllEqual = () => {
    dispatch({ type: "SET_LEFT_ASTIGMATISM", payload: { result: "none", axis: null } });
    setAllEqual(true);
    setDone(true);
  };

  const handleSomeDarker = () => {
    setAllEqual(false);
    dispatch({ type: "SET_LEFT_ASTIGMATISM", payload: { result: "mild", axis: 85 } });
    setDone(true);
  };

  const handleContinue = () => dispatch({ type: "SET_STEP", payload: 9 });

  if (done) {
    return (
      <StepWrapper>
        <div className="flex flex-col items-center text-center max-w-lg mx-auto px-4 py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#05005B] mb-2">Left Eye Astigmatism Check</h3>
          <p className="text-gray-500 text-sm mb-4">
            {allEqual ? "No astigmatism detected." : "Mild astigmatism detected."}
          </p>
          <button onClick={handleContinue} className="w-full max-w-sm py-3.5 px-6 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl transition-all text-sm">
            Continue to Sphere Power Test
          </button>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper>
      <div className="flex flex-col items-center max-w-lg mx-auto px-4 py-6 sm:py-8 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 w-full text-left">
          <p className="text-xs sm:text-sm text-amber-800 font-medium">
            ✋ Cover your <strong>RIGHT</strong> eye. Look at the image below.
          </p>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-[#05005B] mb-3">Astigmatism Test — Left Eye</h2>

        <canvas
          ref={canvasRef}
          className="w-[260px] sm:w-[280px] h-[260px] sm:h-[280px] mb-5"
        />

        <p className="text-sm text-gray-600 mb-5 max-w-xs">
          Do any of the lines appear darker, bolder, or sharper than the others?
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button onClick={handleSomeDarker} className="w-full py-3 px-4 bg-white border-2 border-gray-200 hover:border-[#05005B] rounded-xl text-sm font-medium text-gray-700 hover:text-[#05005B] transition-colors text-left">
            Yes, some lines look darker
          </button>
          <button onClick={handleAllEqual} className="w-full py-3 px-4 bg-white border-2 border-gray-200 hover:border-[#05005B] rounded-xl text-sm font-medium text-gray-700 hover:text-[#05005B] transition-colors text-left">
            All lines look equally dark
          </button>
        </div>
      </div>
    </StepWrapper>
  );
});
