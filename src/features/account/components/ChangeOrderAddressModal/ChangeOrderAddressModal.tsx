import { memo, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateOrderAddress } from "@/features/checkout/api/orderApi";
import type { ShippingAddress } from "@/features/account/utils/shippingAddress";
import {
  validateOrderAddressForm,
  type OrderAddressFormErrors,
  type OrderAddressFormValues,
} from "@/features/account/utils/orderAddress";

const EMPTY_FORM: OrderAddressFormValues = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
};

const toFormValues = (address?: ShippingAddress | null): OrderAddressFormValues => ({
  name: address?.name || "",
  phone: address?.phone || "",
  addressLine1: address?.addressLine1 || "",
  addressLine2: address?.addressLine2 || "",
  city: address?.city || "",
  state: address?.state || "",
  pincode: address?.pincode || "",
  country: address?.country || "",
});

interface ChangeOrderAddressModalProps {
  isOpen: boolean;
  orderId: string;
  address?: ShippingAddress | null;
  onClose: () => void;
  onSuccess: (address: ShippingAddress) => void;
}

export const ChangeOrderAddressModal = memo(function ChangeOrderAddressModal({
  isOpen,
  orderId,
  address,
  onClose,
  onSuccess,
}: ChangeOrderAddressModalProps): JSX.Element | null {
  const [form, setForm] = useState<OrderAddressFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<OrderAddressFormErrors>({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(toFormValues(address));
      setErrors({});
      setApiError("");
      setSaving(false);
    }
  }, [isOpen, address]);

  const handleChange = useCallback(
    (field: keyof OrderAddressFormValues, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setApiError("");
    const validationErrors = validateOrderAddressForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload: ShippingAddress = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      country: form.country.trim(),
    };

    setSaving(true);
    try {
      const res = await updateOrderAddress(orderId, {
        name: payload.name!,
        phone: payload.phone!,
        addressLine1: payload.addressLine1!,
        addressLine2: payload.addressLine2,
        city: payload.city!,
        state: payload.state!,
        pincode: payload.pincode!,
        country: payload.country,
      });
      if (!res?.success) {
        throw new Error(res?.message || "Failed to update the address");
      }
      toast.success("Delivery address updated");
      onSuccess(payload);
      onClose();
    } catch (error: any) {
      setApiError(
        error?.response?.data?.message ||
          error?.message ||
          "Could not update the address. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }, [form, orderId, onClose, onSuccess]);

  if (!isOpen) return null;

  const field = (
    key: keyof OrderAddressFormValues,
    label: string,
    placeholder: string,
    opts: { required?: boolean; numeric?: boolean; maxLength?: number } = {}
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {opts.required && "*"}
      </label>
      <input
        type="text"
        inputMode={opts.numeric ? "numeric" : "text"}
        maxLength={opts.maxLength}
        value={form[key]}
        onChange={(e) =>
          handleChange(key, opts.numeric ? e.target.value.replace(/[^\d+\- ]/g, "") : e.target.value)
        }
        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          errors[key] ? "border-red-400" : "border-gray-300"
        }`}
        placeholder={placeholder}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[110]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4 z-[111]">
        <div className="bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Change Delivery Address</h2>
            <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {apiError && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{apiError}</p>
            )}
            {field("name", "Full Name", "Enter full name", { required: true })}
            {field("phone", "Phone Number", "Phone number", { required: true, numeric: true })}
            {field("addressLine1", "Address Line 1", "House/Flat No., Building Name", {
              required: true,
            })}
            {field("addressLine2", "Address Line 2", "Street, Area, Landmark (optional)")}
            <div className="grid grid-cols-2 gap-4">
              {field("city", "City", "City", { required: true })}
              {field("state", "State", "State", { required: true })}
            </div>
            {field("pincode", "Pincode", "Pincode", { required: true, maxLength: 12 })}
            {field("country", "Country", "Country (optional)")}
          </div>

          <div className="flex gap-3 px-6 py-5 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-gray-100 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`flex-1 py-3.5 rounded-2xl font-medium transition-colors ${
                saving
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

ChangeOrderAddressModal.displayName = "ChangeOrderAddressModal";
