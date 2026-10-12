import { describe, it } from "node:test";
import assert from "node:assert";
import { hasVariant, formatVariantLabel } from "../src/shared/utils/variant.ts";

describe("hasVariant — whether an order/cart line carries a variant", () => {
  it("is true for a snapshot with colour and size", () => {
    assert.strictEqual(
      hasVariant({ variantId: "abc", color: "Black", size: "Medium" }),
      true
    );
  });

  it("is true when only size is present", () => {
    assert.strictEqual(hasVariant({ size: "Large" }), true);
  });

  it("is true when only a snapshot name is present", () => {
    assert.strictEqual(hasVariant({ name: "Black / Medium" }), true);
  });

  it("is false for null, undefined and empty snapshots", () => {
    assert.strictEqual(hasVariant(null), false);
    assert.strictEqual(hasVariant(undefined), false);
    assert.strictEqual(hasVariant({}), false);
  });

  it("is false when every attribute is blank whitespace", () => {
    assert.strictEqual(hasVariant({ color: "  ", size: "", name: " " }), false);
  });
});

describe("formatVariantLabel — human label under the product name", () => {
  it("renders size then colour", () => {
    assert.strictEqual(
      formatVariantLabel({ color: "Black", size: "Medium" }),
      "Size: Medium, Color: Black"
    );
  });

  it("skips attributes that were not stored", () => {
    assert.strictEqual(formatVariantLabel({ color: "Gold" }), "Color: Gold");
    assert.strictEqual(formatVariantLabel({ size: "Free Size" }), "Size: Free Size");
  });

  it("falls back to the snapshot name when there are no attributes", () => {
    assert.strictEqual(
      formatVariantLabel({ name: "Prescription Frame" }),
      "Prescription Frame"
    );
  });

  it("returns an empty string when there is nothing to render", () => {
    assert.strictEqual(formatVariantLabel(null), "");
    assert.strictEqual(formatVariantLabel(undefined), "");
    assert.strictEqual(formatVariantLabel({}), "");
  });
});
