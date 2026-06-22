import { memo, useState } from "react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";
import { NEAR_VISION_LINES } from "../utils/snellenSizes";

export const Step11_NearVision = memo(function Step11_NearVision() {
  const { dispatch } = useEyeTest();
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSelect = (label: string) => {
    setSelected(label);
  };

  const handleConfirm = () => {
    if (!selected) return;
    dispatch({ type: "SET_NEAR_VISION", payload: selected });
    setDone(true);
  };

  if (done) {
    return (
      <StepWrapper>
        <div className="flex flex-col items-center text-center max-w-lg mx-auto px-4 py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#05005B] mb-2">Near Vision Recorded</h3>
          <p className="text-gray-500 text-sm mb-4">Score: <strong>{selected}</strong></p>
          <button onClick={() => dispatch({ type: "SET_STEP", payload: 12 })} className="w-full max-w-sm py-3.5 px-6 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl transition-all text-sm">
            Continue to Color Vision Test
          </button>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper>
      <div className="flex flex-col items-center max-w-lg mx-auto px-4 py-6 sm:py-8 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 w-full text-left">
          <p className="text-xs sm:text-sm text-blue-800 font-medium">
            👀 Keep <strong>both eyes open</strong> for this test.
          </p>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-[#05005B] mb-2">Near Vision Test</h2>
        <p className="text-sm text-gray-500 mb-5 max-w-xs">
          What is the smallest line of text you can read comfortably without straining?
        </p>

        <div className="w-full max-w-sm space-y-2 mb-6">
          {NEAR_VISION_LINES.map((line) => (
            <button
              key={line.label}
              onClick={() => handleSelect(line.label)}
              className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                selected === line.label ? "border-[#05005B] bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-xs text-gray-400 font-medium mr-2">{line.label}</span>
              <span
                className="text-gray-700 leading-tight"
                style={{ fontSize: `${Math.max(8, line.heightMm * 10)}px` }}
              >
                {line.text}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected}
          className={`w-full max-w-sm py-3.5 px-6 rounded-xl font-semibold text-sm transition-all ${
            selected
              ? "bg-[#05005B] hover:bg-[#0a0a7a] text-white hover:scale-[1.02] hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Confirm Selection
        </button>
      </div>
    </StepWrapper>
  );
});
