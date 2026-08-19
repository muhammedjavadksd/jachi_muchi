import { memo, useState, useEffect } from "react";

export const LoadingScreen = memo(function LoadingScreen(): JSX.Element {
  const [visible, setVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src="/logo.png"
        alt="Jachi & Muchi"
        className="w-20 h-20 object-contain mb-5 animate-pulse"
      />
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#05005B] animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-[#05005B] animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-[#05005B] animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
});

LoadingScreen.displayName = "LoadingScreen";
