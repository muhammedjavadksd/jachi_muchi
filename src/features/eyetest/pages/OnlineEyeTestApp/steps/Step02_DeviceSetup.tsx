import { memo, useState, useCallback } from "react";
import { Monitor, SunMedium, EyeOff, Eye } from "lucide-react";
import { useEyeTest } from "../context/EyeTestContext";
import { StepWrapper } from "../components/StepWrapper";

const CHECKLIST = [
  { id: "desktop", label: "I am using a laptop or desktop screen (not mobile) for best accuracy", icon: Monitor },
  { id: "lighting", label: "The room is well lit", icon: SunMedium },
  { id: "remove_glasses", label: "I have removed my current glasses or contact lenses", icon: EyeOff },
  { id: "cover_eye", label: "I am ready to cover one eye at a time during the test", icon: Eye },
];

export const Step02_DeviceSetup = memo(function Step02_DeviceSetup() {
  const { dispatch } = useEyeTest();
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECKLIST.map((c) => [c.id, false]))
  );

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const allChecked = CHECKLIST.every((c) => checked[c.id]);

  const handleContinue = () => {
    dispatch({ type: "SET_DEVICE_CONFIRMED", payload: true });
    dispatch({ type: "SET_STEP", payload: 3 });
  };

  return (
    <StepWrapper>
      <div className="flex flex-col max-w-lg mx-auto px-4 py-6 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#05005B] mb-2">Device & Environment Setup</h2>
        <p className="text-gray-500 text-sm mb-6">Please confirm each item before starting the test.</p>

        <div className="space-y-3 mb-8">
          {CHECKLIST.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                checked[id] ? "border-[#05005B] bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${checked[id] ? "bg-[#05005B]" : "bg-gray-100"}`}>
                <Icon size={18} className={checked[id] ? "text-white" : "text-gray-500"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${checked[id] ? "text-[#05005B]" : "text-gray-700"}`}>{label}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                checked[id] ? "bg-[#05005B] border-[#05005B]" : "border-gray-300"
              }`}>
                {checked[id] && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!allChecked}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base transition-all ${
            allChecked
              ? "bg-[#05005B] hover:bg-[#0a0a7a] text-white hover:scale-[1.02] hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </StepWrapper>
  );
});
