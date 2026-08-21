import { memo } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export type ReviewToastTone = "success" | "error";

export interface ReviewToastState {
  message: string;
  tone: ReviewToastTone;
}

interface ReviewToastProps {
  toast: ReviewToastState | null;
}

const TONE_STYLES: Record<
  ReviewToastTone,
  { bar: string; icon: JSX.Element }
> = {
  success: {
    bar: "bg-teal-600",
    icon: <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />,
  },
  error: {
    bar: "bg-red-500",
    icon: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
  },
};

export const ReviewToast = memo(function ReviewToast({
  toast,
}: ReviewToastProps): JSX.Element {
  const tone = toast ? TONE_STYLES[toast.tone] : null;

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[110] flex items-stretch gap-3 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-out ${
        toast && tone
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <span className={`w-1 shrink-0 ${tone ? tone.bar : "bg-transparent"}`} />
      <div className="flex items-center gap-2.5 py-3 pr-5">
        {tone ? tone.icon : null}
        <p className="text-sm font-medium text-gray-800">
          {toast ? toast.message : ""}
        </p>
      </div>
    </div>
  );
});

ReviewToast.displayName = "ReviewToast";
