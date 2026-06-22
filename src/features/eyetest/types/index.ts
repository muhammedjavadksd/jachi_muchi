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
