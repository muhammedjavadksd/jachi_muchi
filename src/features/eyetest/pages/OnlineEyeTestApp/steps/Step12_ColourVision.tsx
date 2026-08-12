import { memo, useRef, useEffect, useState, useCallback } from "react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";

interface PlateConfig {
  number: string;
  dots: Array<{ x: number; y: number; color: string; r: number }>;
}

function generateIshiharaPlate(canvas: HTMLCanvasElement, number: string): PlateConfig {
  const ctx = canvas.getContext("2d")!;
  const dpr = window.devicePixelRatio || 1;
  const size = 240;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  // Generate dots
  const dots: PlateConfig["dots"] = [];
  const colors = {
    bg: ["#c7503a", "#b8432e", "#d45a42", "#c04c35", "#d1634c"],
    fg: ["#3a8c3a", "#2d7a2d", "#4a9e4a", "#3d8f3d", "#469946"],
    distractor: ["#b8a030", "#a89028", "#c8b040", "#d4bf4a"],
  };

  // Fill background with red-green dots
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 3 + Math.random() * 4;
    const isFg = isInsideNumber(x, y, size, number);
    const colorSet = isFg ? colors.fg : colors.bg;
    dots.push({ x, y, color: colorSet[Math.floor(Math.random() * colorSet.length)], r });
  }

  // Add some distractor dots
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    dots.push({
      x, y,
      color: colors.distractor[Math.floor(Math.random() * colors.distractor.length)],
      r: 2 + Math.random() * 3,
    });
  }

  // Draw
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, size, size);

  for (const dot of dots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = dot.color;
    ctx.fill();
  }

  return { number, dots };
}

function isInsideNumber(x: number, y: number, _size: number, num: string): boolean {
  // Rough bounding areas for numbers in a 240x240 canvas
  const regions: Record<string, Array<[number, number, number, number]>> = {
    "12": [[60, 60, 120, 120], [130, 60, 190, 120]],
    "8":  [[80, 60, 160, 140]],
    "29": [[50, 60, 110, 120], [130, 60, 190, 120]],
  };
  const rects = regions[num] || [];
  for (const [rx, ry, rw, rh] of rects) {
    if (x >= rx && x <= rw && y >= ry && y <= rh) return true;
  }
  return false;
}

const PLATE_NUMBERS = ["12", "8", "29"];

export const Step12_ColourVision = memo(function Step12_ColourVision() {
  const { dispatch } = useEyeTest();
  const [plateIndex, setPlateIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (done) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    generateIshiharaPlate(canvas, PLATE_NUMBERS[plateIndex]);
  }, [plateIndex, done]);

  const handleSubmit = useCallback(() => {
    const newAnswers = [...answers, inputVal.trim()];
    setAnswers(newAnswers);
    setInputVal("");

    if (plateIndex < PLATE_NUMBERS.length - 1) {
      setPlateIndex((i) => i + 1);
    } else {
      // Evaluate
      const correct = newAnswers.filter((a, i) => a === PLATE_NUMBERS[i]).length;
      const total = PLATE_NUMBERS.length;
      let result: string;
      if (correct === total) result = "Normal color vision";
      else if (correct >= total - 1) result = "Possible mild color vision deficiency";
      else result = "Likely color vision deficiency — recommend professional test";
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#05005B] mb-2">Color Vision Screening Complete</h3>
          <p className="text-gray-500 text-sm mb-4">
            {answers.filter((a, i) => a === PLATE_NUMBERS[i]).length} / {PLATE_NUMBERS.length} correct
          </p>
          <button onClick={handleFinish} className="w-full max-w-sm py-3.5 px-6 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl transition-all text-sm">
            View My Results
          </button>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper>
      <div className="flex flex-col items-center max-w-lg mx-auto px-4 py-6 sm:py-8 text-center">
        <p className="text-xs text-gray-400 mb-2">Plate {plateIndex + 1} of {PLATE_NUMBERS.length}</p>

        <canvas
          ref={canvasRef}
          className="w-60 h-60 rounded-xl mb-4 border border-gray-200"
        />

        <p className="text-sm text-gray-600 mb-4">
          What number do you see in the pattern?
        </p>

        <div className="w-full max-w-sm flex gap-2 mb-4">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter number..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-lg font-bold text-[#05005B] focus:border-[#05005B] outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!inputVal.trim()}
            className={`px-6 py-3 rounded-xl font-semibold text-sm ${
              inputVal.trim() ? "bg-[#05005B] hover:bg-[#0a0a7a] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {plateIndex < PLATE_NUMBERS.length - 1 ? "Next" : "Finish"}
          </button>
        </div>

        <div className="flex gap-2">
          {PLATE_NUMBERS.map((_, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${i === plateIndex ? "bg-[#05005B]" : "bg-gray-300"}`} />
          ))}
        </div>
      </div>
    </StepWrapper>
  );
});
