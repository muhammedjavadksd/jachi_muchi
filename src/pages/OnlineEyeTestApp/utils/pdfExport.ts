import type { EyeTestState } from "../context/EyeTestContext";

const JSPDF_CDN = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

function getJsPDF(): any {
  return (window as any).jspdf?.jsPDF;
}

export function exportResultsAsPDF(state: EyeTestState): void {
  const JsPDF = getJsPDF();
  if (JsPDF) {
    generatePDF(state, JsPDF);
    return;
  }

  // Load from CDN
  const script = document.createElement("script");
  script.src = JSPDF_CDN;
  script.onload = () => {
    const loaded = getJsPDF();
    if (loaded) {
      generatePDF(state, loaded);
    } else {
      fallbackPrint(state);
    }
  };
  script.onerror = () => fallbackPrint(state);
  document.body.appendChild(script);
}

function generatePDF(state: EyeTestState, jsPDF: any) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("Online Eye Test Results", 105, y, { align: "center" });
  y += 12;

  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, y, { align: "center" });
  y += 12;

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Right Eye (OD)", 14, y);
  y += 7;
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(`Visual Acuity: ${state.rightEyeAcuity || "N/A"}`, 20, y); y += 6;
  doc.text(`Sphere (SPH): ${state.rightSphereDistance !== null ? state.rightSphereDistance.toFixed(2) : "N/A"}`, 20, y); y += 6;
  doc.text(`Cylinder (CYL): ${state.rightAstigmatism === "none" ? "None" : "-0.75 (approx)"}`, 20, y); y += 6;
  doc.text(`Axis: ${state.rightAxis !== null ? state.rightAxis + "°" : "—"}`, 20, y); y += 10;

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Left Eye (OS)", 14, y);
  y += 7;
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(`Visual Acuity: ${state.leftEyeAcuity || "N/A"}`, 20, y); y += 6;
  doc.text(`Sphere (SPH): ${state.leftSphereDistance !== null ? state.leftSphereDistance.toFixed(2) : "N/A"}`, 20, y); y += 6;
  doc.text(`Cylinder (CYL): ${state.leftAstigmatism === "none" ? "None" : "-0.75 (approx)"}`, 20, y); y += 6;
  doc.text(`Axis: ${state.leftAxis !== null ? state.leftAxis + "°" : "—"}`, 20, y); y += 10;

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Near Vision", 14, y);
  y += 7;
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(`${state.nearVision || "N/A"}`, 20, y); y += 10;

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Color Vision", 14, y);
  y += 7;
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(`${state.colorVision || "N/A"}`, 20, y); y += 15;

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("This test is a screening tool only and does not constitute a medical prescription.", 105, y, { align: "center" });
  y += 5;
  doc.text("Please visit a certified optometrist for a comprehensive eye examination.", 105, y, { align: "center" });

  doc.save("eye-test-results.pdf");
}

/** Fallback: open a print-friendly version so user can "Save as PDF" */
function fallbackPrint(state: EyeTestState) {
  const w = window.open("", "_blank");
  if (!w) return;

  const fmt = (val: any) => (val ?? "N/A").toString();
  const lines = [
    "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Eye Test Results</title>",
    "<style>body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:auto}",
    "h1{font-size:22px;color:#05005B;text-align:center}",
    "h2{font-size:14px;color:#05005B;margin-top:24px;text-transform:uppercase}",
    "p{font-size:13px;margin:4px 0;color:#333}",
    ".date{text-align:center;color:#999;font-size:12px}",
    ".disc{text-align:center;color:#999;font-size:10px;margin-top:32px}",
    ".row{display:flex;justify-content:space-between;padding:2px 0}",
    "</style></head><body>",
    `<h1>Online Eye Test Results</h1>`,
    `<p class='date'>${new Date().toLocaleDateString()}</p>`,
    "<h2>Right Eye (OD)</h2>",
    `<div class='row'><span>Visual Acuity</span><span>${fmt(state.rightEyeAcuity)}</span></div>`,
    `<div class='row'><span>Sphere (SPH)</span><span>${state.rightSphereDistance !== null ? (state.rightSphereDistance >= 0 ? "+" : "") + state.rightSphereDistance.toFixed(2) : "N/A"}</span></div>`,
    `<div class='row'><span>Cylinder (CYL)</span><span>${state.rightAstigmatism === "none" ? "None" : "-0.75 (approx)"}</span></div>`,
    `<div class='row'><span>Axis</span><span>${state.rightAxis !== null ? state.rightAxis + "°" : "—"}</span></div>`,
    "<h2>Left Eye (OS)</h2>",
    `<div class='row'><span>Visual Acuity</span><span>${fmt(state.leftEyeAcuity)}</span></div>`,
    `<div class='row'><span>Sphere (SPH)</span><span>${state.leftSphereDistance !== null ? (state.leftSphereDistance >= 0 ? "+" : "") + state.leftSphereDistance.toFixed(2) : "N/A"}</span></div>`,
    `<div class='row'><span>Cylinder (CYL)</span><span>${state.leftAstigmatism === "none" ? "None" : "-0.75 (approx)"}</span></div>`,
    `<div class='row'><span>Axis</span><span>${state.leftAxis !== null ? state.leftAxis + "°" : "—"}</span></div>`,
    "<h2>Near Vision</h2>",
    `<p>${fmt(state.nearVision)}</p>`,
    "<h2>Color Vision</h2>",
    `<p>${fmt(state.colorVision)}</p>`,
    "<p class='disc'>This test is a screening tool only and does not constitute a medical prescription.</p>",
    "<p class='disc'>Please visit a certified optometrist for a comprehensive eye examination.</p>",
    "</body></html>",
  ];

  w.document.write(lines.join(""));
  w.document.close();
  setTimeout(() => w.print(), 500);
}
