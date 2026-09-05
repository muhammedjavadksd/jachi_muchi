import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, UploadCloud, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  RETURN_REASONS,
  RETURN_SUCCESS_MESSAGE,
} from "@/features/returns/constants";
import { validateReturnImage } from "@/features/returns/helpers/imageRules";
import { useSubmitReturn } from "@/features/returns/hooks";
import type { ReturnReason } from "@/features/returns/types";

interface ReturnFormPayload {
  orderId: string;
  orderItemId: string;
  productName?: string;
  productImage?: string;
  deadline?: string;
}

/**
 * Return request form. Opens via the "return:open-form" window event (dispatched
 * by ReturnButton). Collects a fixed reason from the backend enum, plus two
 * required image uploads (bill/invoice + product photo) validated client-side
 * before submit. Disables Submit while in flight (no double submission). On
 * success shows the exact confirmation message, then redirects to /my-returns.
 */
export const ReturnFormModal = memo(function ReturnFormModal(): JSX.Element | null {
  const navigate = useNavigate();
  const [payload, setPayload] = useState<ReturnFormPayload | null>(null);
  const [reason, setReason] = useState<ReturnReason | "">("");
  const [billFile, setBillFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [billError, setBillError] = useState("");
  const [productError, setProductError] = useState("");
  const [attempted, setAttempted] = useState(false);
  const billInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);
  const { state, submit, reset } = useSubmitReturn();

  const open = Boolean(payload);
  const submitting = state.phase === "submitting";

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ReturnFormPayload>).detail;
      if (!detail?.orderId) return;
      setPayload(detail);
      setReason("");
      setBillFile(null);
      setProductFile(null);
      setBillError("");
      setProductError("");
      setAttempted(false);
      reset();
    };
    window.addEventListener("return:open-form", handler);
    return () => window.removeEventListener("return:open-form", handler);
  }, [reset]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    if (submitting) return;
    setPayload(null);
    reset();
  }, [submitting, reset]);

  const handleBillChange = useCallback((file: File | null) => {
    setBillFile(file);
    if (file) setBillError(validateReturnImage(file));
  }, []);

  const handleProductChange = useCallback((file: File | null) => {
    setProductFile(file);
    if (file) setProductError(validateReturnImage(file));
  }, []);

  const handleSubmit = async () => {
    if (!payload) return;
    setAttempted(true);
    const billErr = validateReturnImage(billFile);
    const productErr = validateReturnImage(productFile);
    setBillError(billErr);
    setProductError(productErr);
    if (billErr || productErr || !reason) return;

    await submit({
      orderId: payload.orderId,
      orderItemId: payload.orderItemId,
      reason: reason as ReturnReason,
      billImage: billFile as File,
      productImage: productFile as File,
    });
  };

  // On success, confirm then close the form and go to the returns list.
  useEffect(() => {
    if (state.phase !== "success") return;
    toast.success(RETURN_SUCCESS_MESSAGE);
    setPayload(null);
    navigate("/my-returns");
  }, [state.phase, navigate]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4" onClick={handleClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-form-title"
      >
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 id="return-form-title" className="text-lg font-bold text-gray-900">Request a Return</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {payload?.productName ? `Returning: ${payload.productName}` : "Return this item"}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {state.phase === "error" && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {state.message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for return</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReturnReason)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 ${
                attempted && !reason ? "border-red-400" : "border-gray-200"
              }`}
            >
              <option value="" disabled>Select a reason</option>
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {attempted && !reason && (
              <p className="text-xs text-red-500 mt-1">Please select a reason for your return.</p>
            )}
          </div>

          <UploadField
            title="Upload bill/invoice photo"
            description="A clear photo of your order bill or invoice"
            file={billFile}
            error={billError}
            showError={attempted}
            inputRef={billInputRef}
            onChange={handleBillChange}
            disabled={submitting}
          />

          <UploadField
            title="Upload product photo"
            description="A clear photo of the product you are returning"
            file={productFile}
            error={productError}
            showError={attempted}
            inputRef={productInputRef}
            onChange={handleProductChange}
            disabled={submitting}
          />
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                Submit Return
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ReturnFormModal.displayName = "ReturnFormModal";

interface UploadFieldProps {
  title: string;
  description: string;
  file: File | null;
  error: string;
  showError: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const UploadField = memo(function UploadField({
  title,
  description,
  file,
  error,
  showError,
  inputRef,
  onChange,
  disabled,
}: UploadFieldProps): JSX.Element {
  return (
    <div>
      <div
        onClick={() => !file && !disabled && inputRef.current?.click()}
        className={`rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
          file ? "border-teal-400 bg-teal-50/50" : "border-gray-200 hover:border-teal-300"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
        {file ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white">
              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="text-xs text-red-600 hover:underline mt-0.5"
              >
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
        )}
      </div>

      {(error || (showError && !file)) && (
        <p className="text-xs text-red-500 mt-1">{error || "This field is required."}</p>
      )}
    </div>
  );
});

UploadField.displayName = "UploadField";
