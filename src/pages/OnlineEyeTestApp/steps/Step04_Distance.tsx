import { memo, useState, useEffect, useCallback } from "react";
import { Ruler, Timer } from "lucide-react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";

export const Step04_Distance = memo(function Step04_Distance() {
  const { dispatch } = useEyeTest();
  const [countdown, setCountdown] = useState(10);
  const [counting, setCounting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!counting || countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [counting, countdown]);

  const handleReady = useCallback(() => {
    setConfirmed(true);
    dispatch({ type: "SET_DISTANCE_CONFIRMED", payload: true });
    setTimeout(() => dispatch({ type: "SET_STEP", payload: 5 }), 600);
  }, [dispatch]);

  const startCountdown = () => {
    setCounting(true);
    setCountdown(10);
  };

  return (
    <StepWrapper>
      <div className="flex flex-col items-center max-w-lg mx-auto px-4 py-6 sm:py-8 text-center">
        <div className="w-14 h-14 bg-[#05005B]/10 rounded-xl flex items-center justify-center mb-4">
          <Ruler size={28} className="text-[#05005B]" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#05005B] mb-3">Viewing Distance Setup</h2>

        <p className="text-gray-500 text-sm mb-4 max-w-sm">
          Sit exactly <strong className="text-[#05005B]">40cm (approximately arm's length)</strong> from the screen.
        </p>

        {/* Animated arm/ruler illustration */}
        <div className="w-full bg-white rounded-xl border border-gray-200 p-6 mb-4 relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
            <span className="text-[#05005B] font-bold text-lg">40cm</span>
            <div className="flex-1 h-0.5 bg-gray-200 relative mx-2">
              <div className="absolute inset-y-0 left-0 bg-[#05005B] animate-pulse" style={{ width: "40%" }} />
            </div>
            <span>Screen</span>
          </div>
          <div className="text-xs text-gray-400 flex items-center justify-center gap-4 mt-2">
            <span>👤 You</span>
            <span className="text-gray-300">← 40cm →</span>
            <span>🖥️</span>
          </div>
        </div>

        {/* String trick */}
        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-left">
          <p className="text-xs text-amber-800 leading-relaxed">
            💡 <strong>Tip:</strong> Cut a string 40cm long. Hold one end to your nose — the other end should just touch the screen.
          </p>
        </div>

        {!confirmed && (
          <>
            {!counting ? (
              <button onClick={startCountdown} className="flex items-center gap-2 py-2.5 px-5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium text-sm transition-colors mb-4">
                <Timer size={16} />
                Start 10s countdown to get into position
              </button>
            ) : (
              <div className="mb-4">
                <div className="text-4xl font-bold text-[#05005B] mb-1">{countdown}</div>
                <p className="text-xs text-gray-400">Get into position...</p>
              </div>
            )}

            <button
              onClick={handleReady}
              disabled={counting && countdown > 0}
              className={`w-full max-w-sm py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base transition-all ${
                counting && countdown > 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#05005B] hover:bg-[#0a0a7a] text-white hover:scale-[1.02] hover:shadow-lg"
              }`}
            >
              {counting && countdown > 0 ? `Wait ${countdown}s` : "I'm Ready"}
            </button>
          </>
        )}

        {confirmed && (
          <div className="text-green-600 font-semibold text-sm animate-pulse">✓ Great! Let's begin the test.</div>
        )}
      </div>
    </StepWrapper>
  );
});
