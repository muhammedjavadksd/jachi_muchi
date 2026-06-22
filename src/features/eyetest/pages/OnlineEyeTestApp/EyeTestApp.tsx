import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { EyeTestProvider, useEyeTest } from "./context/EyeTestContext";
import { ProgressBar } from "./components/ProgressBar";
import { Navbar } from "./components/Navbar";
import { Step01_Welcome } from "./steps/Step01_Welcome";
import { Step02_DeviceSetup } from "./steps/Step02_DeviceSetup";
import { Step03_Calibration } from "./steps/Step03_Calibration";
import { Step04_Distance } from "./steps/Step04_Distance";
import { Step05_AcuityRight } from "./steps/Step05_AcuityRight";
import { Step06_AcuityLeft } from "./steps/Step06_AcuityLeft";
import { Step07_AstigmatismRight } from "./steps/Step07_AstigmatismRight";
import { Step08_AstigmatismLeft } from "./steps/Step08_AstigmatismLeft";
import { Step09_SphereRight } from "./steps/Step09_SphereRight";
import { Step10_SphereLeft } from "./steps/Step10_SphereLeft";
import { Step11_NearVision } from "./steps/Step11_NearVision";
import { Step12_ColourVision } from "./steps/Step12_ColourVision";
import { Step13_Results } from "./steps/Step13_Results";

const TOTAL_STEPS = 13;

function EyeTestFlow() {
  const { state, dispatch } = useEyeTest();
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (state.step > 1) {
      dispatch({ type: "SET_STEP", payload: state.step - 1 });
    }
  }, [state.step, dispatch]);

  const handleClose = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const steps: Record<number, JSX.Element> = {
    1: <Step01_Welcome />,
    2: <Step02_DeviceSetup />,
    3: <Step03_Calibration />,
    4: <Step04_Distance />,
    5: <Step05_AcuityRight />,
    6: <Step06_AcuityLeft />,
    7: <Step07_AstigmatismRight />,
    8: <Step08_AstigmatismLeft />,
    9: <Step09_SphereRight />,
    10: <Step10_SphereLeft />,
    11: <Step11_NearVision />,
    12: <Step12_ColourVision />,
    13: <Step13_Results />,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar
        step={state.step}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onClose={handleClose}
        showBack={state.step > 1}
      />
      <ProgressBar step={state.step} totalSteps={TOTAL_STEPS} />
      <main className="flex-1 flex flex-col">
        {steps[state.step] || <Step01_Welcome />}
      </main>
    </div>
  );
}

export const EyeTestApp = memo(function EyeTestApp() {
  return (
    <EyeTestProvider>
      <EyeTestFlow />
    </EyeTestProvider>
  );
});
