import { memo, useState, useCallback } from "react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";
import { ishiharaPlates } from "../data/ishiharaPlates";

export const Step12_ColourVision = memo(function Step12_ColourVision() {
  const { dispatch } = useEyeTest();
  const [plateIndex, setPlateIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [done, setDone] = useState(false);

  const plate = ishiharaPlates[plateIndex];

  const handleSubmit = useCallback(() => {
    const trimmed = inputVal.trim();
    const newAnswers = [...answers, trimmed];
    setAnswers(newAnswers);
    setInputVal("");

    if (plateIndex < ishiharaPlates.length - 1) {
      setPlateIndex((i) => i + 1);
    } else {
      const correct = newAnswers.filter(
        (a, i) => a === ishiharaPlates[i].correctAnswer
      ).length;
      const total = ishiharaPlates.length;
      let result: string;
      if (correct === total) result = "Normal color vision";
      else if (correct >= total - 1)
        result = "Possible mild color vision deficiency";
      else
        result =
          "Likely color vision deficiency — recommend professional test";
      dispatch({ type: "SET_COLOR_VISION", payload: { result, raw: correct } });
      setDone(true);
    }
  }, [answers, inputVal, plateIndex, dispatch]);

  const handleFinish = () => dispatch({ type: "SET_STEP", payload: 13 });

  if (done) {
    return (
      <StepWrapper>
        <div className="flex flex-col items-center text-center max-w-lg mx-auto px-4 py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#05005B] mb-2">
            Color Vision Screening Complete
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {answers.filter((a, i) => a === ishiharaPlates[i].correctAnswer).length} / {ishiharaPlates.length} correct
          </p>
          <button
            onClick={handleFinish}
            className="w-full max-w-sm py-3.5 px-6 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl transition-all text-sm"
          >
            View My Results
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
            Look at the colored circle below and identify the number hidden in
            the dot pattern.
          </p>
        </div>

        <p className="text-xs text-gray-400 mb-2">
          Plate {plateIndex + 1} of {ishiharaPlates.length}
        </p>

        <img
          src={plate.image}
          alt={`Color vision plate ${plateIndex + 1}`}
          className="w-60 h-60 rounded-full mb-4 border border-gray-200 object-cover"
        />

        <p className="text-sm text-gray-600 mb-4">
          What number do you see in the pattern?
        </p>

        <div className="w-full max-w-sm flex gap-2 mb-4">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputVal.trim()) handleSubmit();
            }}
            placeholder="Enter number..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-lg font-bold text-[#05005B] focus:border-[#05005B] outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!inputVal.trim()}
            className={`px-6 py-3 rounded-xl font-semibold text-sm ${
              inputVal.trim()
                ? "bg-[#05005B] hover:bg-[#0a0a7a] text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {plateIndex < ishiharaPlates.length - 1 ? "Next" : "Finish"}
          </button>
        </div>

        <div className="flex gap-2">
          {ishiharaPlates.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === plateIndex ? "bg-[#05005B]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </StepWrapper>
  );
});
