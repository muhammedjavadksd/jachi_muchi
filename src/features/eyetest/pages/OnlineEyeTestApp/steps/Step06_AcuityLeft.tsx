import { memo, useState, useCallback, useMemo } from "react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";
import { SNELLEN_LINES, getSnellenPx, generateOptions } from "../utils/snellenSizes";

export const Step06_AcuityLeft = memo(function Step06_AcuityLeft() {
  const { state, dispatch } = useEyeTest();
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);

  const line = SNELLEN_LINES[lineIndex];
  const fontSizePx = getSnellenPx(lineIndex, state.ppi);

  const displayedLetter = useMemo(
    () => line.letters[Math.floor(Math.random() * line.letters.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineIndex]
  );

  const options = useMemo(() => generateOptions(displayedLetter), [displayedLetter]);

  const handleLetterClick = useCallback(
    (selectedLetter: string) => {
      if (selectedLetter === displayedLetter) {
        if (lineIndex >= SNELLEN_LINES.length - 1) {
          dispatch({ type: "SET_LEFT_ACUITY", payload: line.label });
          setDone(true);
        } else {
          setLineIndex((i) => i + 1);
        }
      } else {
        const prevLabel =
          lineIndex > 0 ? SNELLEN_LINES[lineIndex - 1].label : line.label;
        dispatch({ type: "SET_LEFT_ACUITY", payload: prevLabel });
        setDone(true);
      }
    },
    [displayedLetter, line, lineIndex, dispatch]
  );

  const handleDone = () => {
    dispatch({ type: "SET_STEP", payload: 7 });
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
          <h3 className="text-lg font-bold text-[#05005B] mb-2">Left Eye Complete</h3>
          <p className="text-gray-500 text-sm mb-4">Recorded acuity: <strong>{state.leftEyeAcuity}</strong></p>
          <p className="text-xs text-gray-400 mb-6">Astigmatism test is next.</p>
          <button onClick={handleDone} className="w-full max-w-sm py-3.5 px-6 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl transition-all text-sm">
            Continue to Astigmatism Test
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
            ✋ Cover your <strong>RIGHT</strong> eye completely with your palm. Do not press on the eye.
          </p>
        </div>

        <p className="text-xs text-gray-400 mb-2">Line: {lineIndex + 1} of {SNELLEN_LINES.length} · {line.label}</p>

        <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 mb-6 w-full flex items-center justify-center" style={{ minHeight: 200 }}>
          <span
            className="font-mono font-bold text-[#05005B] select-none leading-none"
            style={{ fontSize: fontSizePx }}
          >
            {displayedLetter}
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-3">Which letter do you see?</p>

        <div className="grid grid-cols-5 gap-2 w-full max-w-sm mb-2">
          {options.map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className="py-3 sm:py-4 bg-white border-2 border-gray-200 hover:border-[#05005B] rounded-xl font-mono font-bold text-lg sm:text-xl text-[#05005B] transition-colors"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </StepWrapper>
  );
});
