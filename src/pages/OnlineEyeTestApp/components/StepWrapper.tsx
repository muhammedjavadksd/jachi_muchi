import { memo, useEffect, useState, type ReactNode } from "react";

interface StepWrapperProps {
  children: ReactNode;
  direction?: "forward" | "backward";
}

export const StepWrapper = memo(function StepWrapper({ children, direction = "forward" }: StepWrapperProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [children]);

  return (
    <div
      className={`transition-all duration-400 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : `opacity-0 ${direction === "forward" ? "translate-y-6" : "-translate-y-6"}`
      }`}
    >
      {children}
    </div>
  );
});
