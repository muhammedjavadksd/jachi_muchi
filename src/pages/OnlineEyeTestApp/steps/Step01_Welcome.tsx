import { memo } from "react";
import { Eye, Clock, AlertTriangle } from "lucide-react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";

export const Step01_Welcome = memo(function Step01_Welcome() {
  const { dispatch } = useEyeTest();

  return (
    <StepWrapper>
      <div className="flex flex-col items-center text-center max-w-lg mx-auto px-4 py-8 sm:py-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#05005B] rounded-2xl flex items-center justify-center mb-6">
          <Eye size={36} className="text-white sm:w-[44px] sm:h-[44px]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#05005B] mb-3">Online Eye Test</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-sm">
          Check your vision from the comfort of your home in under 5 minutes.
        </p>

        <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left flex gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
            This is a vision screening tool only. It does not replace a professional eye exam. Consult an eye doctor for an accurate prescription.
          </p>
        </div>

        <div className="w-full bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 text-sm mb-2">This test covers:</h3>
          <ul className="space-y-1.5 text-sm text-gray-600">
            {["Visual Acuity (Snellen Chart)", "Astigmatism (Sunburst Dial)", "Sphere Power (Near & Far)", "Near Vision (Reading)", "Color Vision Screening"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#05005B]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
          <Clock size={16} />
          <span>~5 minutes</span>
        </div>

        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
          className="w-full max-w-sm py-3.5 px-6 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg text-sm sm:text-base"
        >
          Start Test
        </button>
      </div>
    </StepWrapper>
  );
});
