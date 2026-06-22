import { memo, useState, useEffect, useCallback } from "react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";
import { getBlurForPower, getSphereTestLetter } from "../utils/blurSimulator";

export const Step09_SphereRight = memo(function Step09_SphereRight() {
  const { dispatch } = useEyeTest();
  const [power, setPower] = useState(0);
  const [letter] = useState(getSphereTestLetter);
  const [done, setDone] = useState(false);
  const [blur, setBlur] = useState(0.3);

  useEffect(() => {
    setBlur(getBlurForPower(power));
  }, [power]);

  const handleConfirm = useCallback(() => {
    dispatch({ type: "SET_RIGHT_SPHERE", payload: power });
    setDone(true);
  }, [power, dispatch]);

  if (done) {
    return (
      <StepWrapper>
        <div className="flex flex-col items-center text-center max-w-lg mx-auto px-4 py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#05005B] mb-2">Right Eye Sphere Recorded</h3>
          <p className="text-gray-500 text-sm mb-4">Sphere: <strong>{power >= 0 ? "+" : ""}{power.toFixed(2)}</strong></p>
          <button onClick={() => dispatch({ type: "SET_STEP", payload: 10 })} className="w-full max-w-sm py-3.5 px-6 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl transition-all text-sm">
            Continue to Left Eye
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
            ✋ Cover your <strong>LEFT</strong> eye. Adjust the slider until the letter appears sharp and clear.
          </p>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-[#05005B] mb-4">Sphere Power — Right Eye (Distance)</h2>

        {/* Blurred letter */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 mb-5 w-full flex items-center justify-center" style={{ minHeight: 160 }}>
          <span
            className="font-mono font-bold text-[#05005B] text-6xl sm:text-7xl select-none"
            style={{ filter: `blur(${blur}px)` }}
          >
            {letter}
          </span>
        </div>

        {/* Slider */}
        <div className="w-full max-w-sm mb-2">
          <input
            type="range"
            min="-6"
            max="4"
            step="0.25"
            value={power}
            onChange={(e) => setPower(parseFloat(e.target.value))}
            className="w-full accent-[#05005B]"
            aria-label="Adjust sphere power"
          />
        </div>

        <div className="flex items-center justify-between w-full max-w-sm text-xs text-gray-400 mb-4">
          <span>-6.00 (Nearsighted)</span>
          <span>0.00</span>
          <span>+4.00 (Farsighted)</span>
        </div>

        <div className="text-center mb-5">
          <span className="text-2xl font-bold text-[#05005B]">{power >= 0 ? "+" : ""}{power.toFixed(2)}</span>
          <span className="text-gray-400 ml-1">D</span>
        </div>

        <button onClick={handleConfirm} className="w-full max-w-sm py-3.5 px-6 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl transition-all text-sm">
          This looks clearest
        </button>
      </div>
    </StepWrapper>
  );
});
