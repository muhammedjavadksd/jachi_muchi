import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react";

export interface EyeTestState {
  step: number;
  deviceConfirmed: boolean;
  ppi: number;
  ppiCalibrated: boolean;
  distanceConfirmed: boolean;

  rightEyeAcuity: string;
  leftEyeAcuity: string;

  rightAstigmatism: string;
  rightAxis: number | null;
  leftAstigmatism: string;
  leftAxis: number | null;

  rightSphereDistance: number | null;
  leftSphereDistance: number | null;

  nearVision: string;

  colorVision: string;
  colorVisionRaw: number;

  testComplete: boolean;
}

const initialState: EyeTestState = {
  step: 1,
  deviceConfirmed: false,
  ppi: 96,
  ppiCalibrated: false,
  distanceConfirmed: false,

  rightEyeAcuity: "",
  leftEyeAcuity: "",

  rightAstigmatism: "",
  rightAxis: null,
  leftAstigmatism: "",
  leftAxis: null,

  rightSphereDistance: null,
  leftSphereDistance: null,

  nearVision: "",

  colorVision: "",
  colorVisionRaw: 0,

  testComplete: false,
};

type Action =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_DEVICE_CONFIRMED"; payload: boolean }
  | { type: "SET_PPI"; payload: { ppi: number; calibrated: boolean } }
  | { type: "SET_DISTANCE_CONFIRMED"; payload: boolean }
  | { type: "SET_RIGHT_ACUITY"; payload: string }
  | { type: "SET_LEFT_ACUITY"; payload: string }
  | { type: "SET_RIGHT_ASTIGMATISM"; payload: { result: string; axis: number | null } }
  | { type: "SET_LEFT_ASTIGMATISM"; payload: { result: string; axis: number | null } }
  | { type: "SET_RIGHT_SPHERE"; payload: number | null }
  | { type: "SET_LEFT_SPHERE"; payload: number | null }
  | { type: "SET_NEAR_VISION"; payload: string }
  | { type: "SET_COLOR_VISION"; payload: { result: string; raw: number } }
  | { type: "COMPLETE_TEST" }
  | { type: "RESET" };

function eyeTestReducer(state: EyeTestState, action: Action): EyeTestState {
  switch (action.type) {
    case "SET_STEP": return { ...state, step: action.payload };
    case "SET_DEVICE_CONFIRMED": return { ...state, deviceConfirmed: action.payload };
    case "SET_PPI": return { ...state, ppi: action.payload.ppi, ppiCalibrated: action.payload.calibrated };
    case "SET_DISTANCE_CONFIRMED": return { ...state, distanceConfirmed: action.payload };
    case "SET_RIGHT_ACUITY": return { ...state, rightEyeAcuity: action.payload };
    case "SET_LEFT_ACUITY": return { ...state, leftEyeAcuity: action.payload };
    case "SET_RIGHT_ASTIGMATISM": return { ...state, rightAstigmatism: action.payload.result, rightAxis: action.payload.axis };
    case "SET_LEFT_ASTIGMATISM": return { ...state, leftAstigmatism: action.payload.result, leftAxis: action.payload.axis };
    case "SET_RIGHT_SPHERE": return { ...state, rightSphereDistance: action.payload };
    case "SET_LEFT_SPHERE": return { ...state, leftSphereDistance: action.payload };
    case "SET_NEAR_VISION": return { ...state, nearVision: action.payload };
    case "SET_COLOR_VISION": return { ...state, colorVision: action.payload.result, colorVisionRaw: action.payload.raw };
    case "COMPLETE_TEST": return { ...state, testComplete: true };
    case "RESET": return initialState;
    default: return state;
  }
}

interface EyeTestContextType {
  state: EyeTestState;
  dispatch: React.Dispatch<Action>;
}

const EyeTestContext = createContext<EyeTestContextType | null>(null);

export function EyeTestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(eyeTestReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <EyeTestContext.Provider value={value}>{children}</EyeTestContext.Provider>;
}

export function useEyeTest(): EyeTestContextType {
  const ctx = useContext(EyeTestContext);
  if (!ctx) throw new Error("useEyeTest must be used within EyeTestProvider");
  return ctx;
}
