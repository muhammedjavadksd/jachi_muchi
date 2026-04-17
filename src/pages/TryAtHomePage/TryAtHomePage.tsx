import { memo, useCallback, useEffect, useRef, useState } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

const HEADER_SPACER_HEIGHT = 140;

const INSTRUCTIONS =
  "Face a light source, align your face, take off your glasses, and tuck your hair behind your ears.";

/**
 * Try at Home page – camera access, face alignment guide, and photo capture
 */
export const TryAtHomePage = memo(function TryAtHomePage(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [cameraState, setCameraState] = useState<"idle" | "loading" | "ready" | "denied" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  /** Request camera and attach to video element */
  const startCamera = useCallback(async () => {
    setCameraState("loading");
    setErrorMessage("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraState("ready");
    } catch (err) {
      streamRef.current = null;
      const message = err instanceof Error ? err.message : "Could not access camera";
      if (message.toLowerCase().includes("permission") || message.toLowerCase().includes("denied")) {
        setCameraState("denied");
        setErrorMessage("Camera access was denied. Please allow camera in your browser settings and refresh.");
      } else if (message.toLowerCase().includes("not found") || message.toLowerCase().includes("devices")) {
        setCameraState("error");
        setErrorMessage("No camera found. Please connect a camera and try again.");
      } else {
        setCameraState("error");
        setErrorMessage("Unable to access camera. Please check permissions and try again.");
      }
    }
  }, []);

  /** Stop camera tracks on unmount or when resetting */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  /** Start camera on mount or when returning from captured state (ask for permission) */
  useEffect(() => {
    if (cameraState === "idle" && !capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [cameraState, capturedImage, startCamera, stopCamera]);

  /** Take photo from current video frame */
  const handleTakePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current || video.readyState < 2) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvasRef.current = canvas;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);
    stopCamera();
    setCameraState("idle");
  }, [stopCamera]);

  /** Retake: clear captured image and request camera again (effect will start camera) */
  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setCameraState("idle");
  }, []);

  const spacerStyle = { height: `${HEADER_SPACER_HEIGHT}px` };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-6 sm:py-10 lg:py-12">
        <Container className="max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Try at Home</h1>
            <p className="text-sm text-gray-600 mt-1">Position your face in the guide and take a photo to get started.</p>
          </div>

          {/* Instructions */}
          <p className="text-center text-sm text-gray-700 mb-6 px-2">
            {INSTRUCTIONS}
          </p>

          {/* Camera / Preview area */}
          <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
            {cameraState === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <p className="text-sm">Requesting camera access…</p>
                <p className="text-xs text-gray-300">Please allow camera when your browser asks.</p>
              </div>
            )}

            {cameraState === "denied" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="font-medium">Camera access denied</p>
                <p className="text-sm text-gray-300">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => setCameraState("idle")}
                  className="mt-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {cameraState === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-medium">Camera error</p>
                <p className="text-sm text-gray-300">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => setCameraState("idle")}
                  className="mt-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {cameraState === "ready" && !capturedImage && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  style={{ filter: "hue-rotate(0deg)" }}
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
                {/* Face alignment guide – dashed oval */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  aria-hidden
                >
                  <div
                    className="w-[75%] max-w-[320px] aspect-[3/4] rounded-[50%] border-2 border-dashed border-green-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]"
                    style={{ boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.25)" }}
                  />
                </div>
              </>
            )}

            {capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <img
                  src={capturedImage}
                  alt="Captured face"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <p className="text-white text-sm mt-3">Photo captured. You can try on frames next.</p>
              </div>
            )}
          </div>

          {/* Take Photo / Retake buttons */}
          <div className="flex justify-center gap-3 mt-6">
            {cameraState === "ready" && !capturedImage && (
              <button
                type="button"
                onClick={handleTakePhoto}
                className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors shadow-md"
              >
                Take Photo
              </button>
            )}
            {capturedImage && (
              <button
                type="button"
                onClick={handleRetake}
                className="px-8 py-3 rounded-xl bg-gray-700 hover:bg-gray-800 text-white font-semibold transition-colors"
              >
                Retake
              </button>
            )}
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

TryAtHomePage.displayName = "TryAtHomePage";
