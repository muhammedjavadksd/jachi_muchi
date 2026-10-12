import { describe, it } from "node:test";
import assert from "node:assert";
import {
  EDITABLE_ORDER_STATUSES,
  isOrderAddressEditable,
  getAddressLockReason,
  validateOrderAddressForm,
} from "../src/features/account/utils/orderAddress.ts";

const validForm = (overrides = {}) => ({
  name: "Jane Doe",
  phone: "+974 5555 1234",
  addressLine1: "12 MG Road",
  addressLine2: "Apt 4B",
  city: "Doha",
  state: "Doha",
  pincode: "12345",
  country: "Qatar",
  ...overrides,
});

describe("isOrderAddressEditable - Change-address button visibility", () => {
  it("exposes only the pending and confirmed statuses", () => {
    assert.deepStrictEqual([...EDITABLE_ORDER_STATUSES], ["pending", "confirmed"]);
  });

  it("is true while pending or confirmed", () => {
    assert.strictEqual(isOrderAddressEditable("pending"), true);
    assert.strictEqual(isOrderAddressEditable("confirmed"), true);
  });

  it("is false once shipped, delivered, cancelled or refunded", () => {
    for (const status of ["shipped", "delivered", "cancelled", "refunded"]) {
      assert.strictEqual(isOrderAddressEditable(status), false);
    }
  });

  it("is false for null/undefined/unknown statuses", () => {
    assert.strictEqual(isOrderAddressEditable(undefined), false);
    assert.strictEqual(isOrderAddressEditable(null), false);
    assert.strictEqual(isOrderAddressEditable("processing"), false);
  });
});

describe("getAddressLockReason - explains why editing is disabled", () => {
  it("mentions the specific terminal status", () => {
    assert.match(getAddressLockReason("shipped"), /shipped/);
    assert.match(getAddressLockReason("delivered"), /deliver/);
    assert.match(getAddressLockReason("cancelled"), /cancelled/);
    assert.match(getAddressLockReason("refunded"), /refunded/);
  });

  it("falls back to a generic note", () => {
    assert.match(getAddressLockReason(undefined), /no longer/);
  });
});

describe("validateOrderAddressForm - inline validation mirrors the API", () => {
  it("accepts a complete valid address", () => {
    assert.deepStrictEqual(validateOrderAddressForm(validForm()), {});
  });

  it("accepts missing optional fields (line 2, country)", () => {
    assert.deepStrictEqual(
      validateOrderAddressForm(validForm({ addressLine2: "", country: "" })),
      {}
    );
  });

  it("requires the mandatory fields", () => {
    const errors = validateOrderAddressForm(
      validForm({ name: "", phone: "", addressLine1: "", city: "", state: "", pincode: "" })
    );
    assert.ok(errors.name);
    assert.ok(errors.phone);
    assert.ok(errors.addressLine1);
    assert.ok(errors.city);
    assert.ok(errors.state);
    assert.ok(errors.pincode);
  });

  it("rejects a malformed phone number", () => {
    assert.ok(validateOrderAddressForm(validForm({ phone: "abc" })).phone);
    assert.ok(validateOrderAddressForm(validForm({ phone: "123" })).phone);
  });

  it("rejects a malformed pincode", () => {
    assert.ok(validateOrderAddressForm(validForm({ pincode: "!" })).pincode);
    assert.ok(validateOrderAddressForm(validForm({ pincode: "a" })).pincode);
    assert.ok(validateOrderAddressForm(validForm({ pincode: "1".repeat(13) })).pincode);
  });

  it("rejects over-long fields", () => {
    assert.ok(validateOrderAddressForm(validForm({ name: "x".repeat(101) })).name);
    assert.ok(validateOrderAddressForm(validForm({ addressLine2: "x".repeat(201) })).addressLine2);
    assert.ok(validateOrderAddressForm(validForm({ country: "x".repeat(61) })).country);
  });
});
