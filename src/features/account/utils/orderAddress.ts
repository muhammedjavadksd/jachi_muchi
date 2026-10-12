/**
 * Order statuses during which the delivery address may still be changed. Kept
 * in sync with the backend's `EDITABLE_ORDER_STATUSES` so the "Change address"
 * button is only offered when the PATCH endpoint will accept the edit.
 */
export const EDITABLE_ORDER_STATUSES = ["pending", "confirmed"] as const;

export function isOrderAddressEditable(status?: string | null): boolean {
  return (EDITABLE_ORDER_STATUSES as readonly string[]).includes(status || "");
}

/**
 * Short, customer-facing note explaining why the address is now locked, shown
 * in place of the "Change address" button.
 */
export function getAddressLockReason(status?: string | null): string {
  switch (status) {
    case "shipped":
      return "The address can't be changed once your order has shipped.";
    case "delivered":
      return "The address can't be changed after delivery.";
    case "cancelled":
      return "This order was cancelled, so its address can't be changed.";
    case "refunded":
      return "This order was refunded, so its address can't be changed.";
    default:
      return "The address can no longer be changed for this order.";
  }
}

/** Editable delivery-address fields, mirroring the order's shipping snapshot. */
export interface OrderAddressFormValues {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type OrderAddressFormErrors = Partial<Record<keyof OrderAddressFormValues, string>>;

const trim = (value?: string): string => (value || "").trim();

/**
 * Client-side mirror of the backend address validation, so shoppers get inline
 * feedback before the request. The backend remains authoritative.
 */
export function validateOrderAddressForm(
  values: OrderAddressFormValues
): OrderAddressFormErrors {
  const errors: OrderAddressFormErrors = {};

  const name = trim(values.name);
  if (!name) errors.name = "Full name is required.";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  else if (name.length > 100) errors.name = "Name must be 100 characters or fewer.";

  const phone = trim(values.phone);
  if (!phone) errors.phone = "Phone number is required.";
  else if (!/^\+?\d{7,15}$/.test(phone.replace(/[\s\-().]/g, "")))
    errors.phone = "Enter a valid phone number.";

  const addressLine1 = trim(values.addressLine1);
  if (!addressLine1) errors.addressLine1 = "Address line 1 is required.";
  else if (addressLine1.length < 3) errors.addressLine1 = "Address line 1 is too short.";
  else if (addressLine1.length > 200) errors.addressLine1 = "Address line 1 is too long.";

  if (trim(values.addressLine2).length > 200) errors.addressLine2 = "Address line 2 is too long.";

  const city = trim(values.city);
  if (!city) errors.city = "City is required.";
  else if (city.length < 2) errors.city = "City is too short.";

  const state = trim(values.state);
  if (!state) errors.state = "State is required.";
  else if (state.length < 2) errors.state = "State is too short.";

  const pincode = trim(values.pincode);
  if (!pincode) errors.pincode = "Pincode is required.";
  else if (!/^[A-Za-z0-9][A-Za-z0-9\- ]{1,11}$/.test(pincode))
    errors.pincode = "Pincode must be 2–12 letters, numbers or dashes.";

  if (trim(values.country).length > 60) errors.country = "Country is too long.";

  return errors;
}
