import { memo, useEffect, useCallback } from "react";
import { Download, RotateCcw, ShoppingBag, AlertTriangle, Eye } from "lucide-react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";
import { exportResultsAsPDF } from "../utils/pdfExport";

export const Step13_Results = memo(function Step13_Results() {
  const { state, dispatch } = useEyeTest();

  useEffect(() => {
    // Save to localStorage
    const result = {
      ...state,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("eyeTestResult", JSON.stringify(result));
    dispatch({ type: "COMPLETE_TEST" });
  }, []);

  const buildInterpretation = useCallback(() => {
    const lines: string[] = [];

    // Right eye acuity
    if (state.rightEyeAcuity) {
      const val = parseFloat(state.rightEyeAcuity.split("/")[1]);
      if (val <= 6) lines.push("Your right eye vision is near normal.");
      else if (val <= 12) lines.push("Your right eye has mild myopia (nearsightedness). You may benefit from corrective lenses.");
      else if (val <= 24) lines.push("Your right eye has moderate myopia. Corrective lenses are recommended.");
      else lines.push("Your right eye has significant vision reduction. Please consult an optometrist.");
    }

    // Left eye acuity
    if (state.leftEyeAcuity) {
      const val = parseFloat(state.leftEyeAcuity.split("/")[1]);
      if (val <= 6) lines.push("Your left eye vision is near normal.");
      else if (val <= 12) lines.push("Your left eye has mild myopia. You may benefit from corrective lenses.");
      else if (val <= 24) lines.push("Your left eye has moderate myopia. Corrective lenses are recommended.");
      else lines.push("Your left eye has significant vision reduction. Please consult an optometrist.");
    }

    // Astigmatism
    if (state.rightAstigmatism !== "none") lines.push("Mild astigmatism detected in the right eye.");
    if (state.leftAstigmatism !== "none") lines.push("Mild astigmatism detected in the left eye.");

    // Sphere
    if (state.rightSphereDistance !== null) {
      const s = state.rightSphereDistance;
      if (s < -0.5) lines.push(`Your right eye has approximately ${Math.abs(s).toFixed(2)}D of nearsightedness.`);
      else if (s > 0.5) lines.push(`Your right eye has approximately ${s.toFixed(2)}D of farsightedness.`);
      else lines.push("Your right eye sphere power is within normal range.");
    }
    if (state.leftSphereDistance !== null) {
      const s = state.leftSphereDistance;
      if (s < -0.5) lines.push(`Your left eye has approximately ${Math.abs(s).toFixed(2)}D of nearsightedness.`);
      else if (s > 0.5) lines.push(`Your left eye has approximately ${s.toFixed(2)}D of farsightedness.`);
      else lines.push("Your left eye sphere power is within normal range.");
    }

    // Near vision
    if (state.nearVision) {
      const n = parseInt(state.nearVision.replace(/\D/g, ""));
      if (n <= 8) lines.push("Your near vision is good. Reading is comfortable.");
      else if (n <= 12) lines.push("Your near vision is normal. Most text is readable.");
      else if (n <= 18) lines.push("You have mild reading difficulty. Consider reading glasses.");
      else lines.push("You have significant reading difficulty. Reading glasses are recommended.");
    }

    // Color vision
    if (state.colorVision) {
      lines.push(`${state.colorVision}.`);
    }

    return lines;
  }, [state]);

  const interpretations = buildInterpretation();

  const handleRetake = () => {
    localStorage.removeItem("eyeTestResult");
    dispatch({ type: "RESET" });
    dispatch({ type: "SET_STEP", payload: 1 });
  };

  return (
    <StepWrapper>
      <div className="max-w-lg mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#05005B] rounded-xl flex items-center justify-center">
            <Eye size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#05005B]">Your Vision Results</h1>
            <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Results card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mb-5 space-y-5">
          {/* Right Eye */}
          <div>
            <h3 className="text-sm font-bold text-[#05005B] uppercase tracking-wider mb-2">Right Eye (OD)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <ResultRow label="Visual Acuity" value={state.rightEyeAcuity || "N/A"} />
              <ResultRow label="Sphere (SPH)" value={state.rightSphereDistance !== null ? `${state.rightSphereDistance >= 0 ? "+" : ""}${state.rightSphereDistance.toFixed(2)}` : "N/A"} />
              <ResultRow label="Cylinder (CYL)" value={state.rightAstigmatism === "none" ? "None" : "-0.75 (approx)"} />
              <ResultRow label="Axis" value={state.rightAxis !== null ? `${state.rightAxis}°` : "—"} />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Left Eye */}
          <div>
            <h3 className="text-sm font-bold text-[#05005B] uppercase tracking-wider mb-2">Left Eye (OS)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <ResultRow label="Visual Acuity" value={state.leftEyeAcuity || "N/A"} />
              <ResultRow label="Sphere (SPH)" value={state.leftSphereDistance !== null ? `${state.leftSphereDistance >= 0 ? "+" : ""}${state.leftSphereDistance.toFixed(2)}` : "N/A"} />
              <ResultRow label="Cylinder (CYL)" value={state.leftAstigmatism === "none" ? "None" : "-0.75 (approx)"} />
              <ResultRow label="Axis" value={state.leftAxis !== null ? `${state.leftAxis}°` : "—"} />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Near & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Near Vision</h3>
              <p className="text-sm font-semibold text-[#05005B]">{state.nearVision || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Color Vision</h3>
              <p className="text-sm font-semibold text-[#05005B] text-ellipsis overflow-hidden">{state.colorVision || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        {interpretations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 mb-5">
            <h3 className="text-sm font-bold text-[#05005B] mb-2">Interpretation</h3>
            <ul className="space-y-1.5">
              {interpretations.map((line, i) => (
                <li key={i} className="text-xs sm:text-sm text-gray-700 leading-relaxed flex items-start gap-1.5">
                  <span className="text-[#05005B] mt-0.5">•</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            ⚠ This test is a screening tool only and does not constitute a medical prescription. Results may not be fully accurate. Please visit a certified optometrist or ophthalmologist for a comprehensive eye examination and accurate prescription.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => exportResultsAsPDF(state)} className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl transition-all text-sm">
            <Download size={16} />
            Download as PDF
          </button>
          <button onClick={handleRetake} className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 border-2 border-gray-300 hover:border-[#05005B] text-gray-600 hover:text-[#05005B] font-semibold rounded-xl transition-all text-sm">
            <RotateCcw size={16} />
            Retake Test
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-sm">
            <ShoppingBag size={16} />
            Shop Glasses
          </button>
        </div>
      </div>
    </StepWrapper>
  );
});

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className="font-semibold text-[#05005B] text-xs">{value}</span>
    </div>
  );
}
