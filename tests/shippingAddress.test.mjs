import { describe, it } from "node:test";
import assert from "node:assert";
import {
  hasShippingAddress,
  formatShippingAddress,
  formatShippingAddressLines,
  formatStreetLine,
  formatLocalityLine,
} from "../src/features/account/utils/shippingAddress.ts";

const UNRENDERABLE = /null|undefined/i;

const assertCleanLines = (lines) => {
  for (const line of lines) {
    assert.strictEqual(typeof line, "string");
    assert.notStrictEqual(line.trim(), "", "empty line rendered");
    assert.doesNotMatch(line, UNRENDERABLE, `line contains a placeholder: ${line}`);
  }
};

describe("hasShippingAddress — order snapshot presence", () => {
  it("is true for a complete snapshot", () => {
    assert.strictEqual(
      hasShippingAddress({
        name: "Jane",
        phone: "9876543210",
        addressLine1: "12 MG Road",
        addressLine2: "Apt 4B",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
      }),
      true
    );
  });

  it("is true when only part of the snapshot is present", () => {
    assert.strictEqual(hasShippingAddress({ city: "Kochi" }), true);
    assert.strictEqual(hasShippingAddress({ pincode: "682001" }), true);
  });

  it("is false for null, undefined and empty snapshots", () => {
    assert.strictEqual(hasShippingAddress(null), false);
    assert.strictEqual(hasShippingAddress(undefined), false);
    assert.strictEqual(hasShippingAddress({}), false);
  });

  it("is false when every field is blank whitespace", () => {
    assert.strictEqual(
      hasShippingAddress({ addressLine1: "  ", city: "", state: "  ", pincode: "" }),
      false
    );
  });
});

describe("formatShippingAddress — readable one-line address", () => {
  it("joins every component in order", () => {
    assert.strictEqual(
      formatShippingAddress({
        addressLine1: "12 MG Road",
        addressLine2: "Apt 4B",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
      }),
      "12 MG Road, Apt 4B, Kochi, Kerala, 682001"
    );
  });

  it("skips missing parts without dangling separators", () => {
    assert.strictEqual(
      formatShippingAddress({
        addressLine1: "12 MG Road",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
      }),
      "12 MG Road, Kochi, Kerala, 682001"
    );
  });

  it("handles a line-1-only snapshot", () => {
    assert.strictEqual(
      formatShippingAddress({ addressLine1: "12 MG Road" }),
      "12 MG Road"
    );
  });

  it("returns an empty string when there is nothing to render", () => {
    assert.strictEqual(formatShippingAddress(null), "");
    assert.strictEqual(formatShippingAddress(undefined), "");
    assert.strictEqual(formatShippingAddress({}), "");
  });

  it("appends the country when present", () => {
    assert.strictEqual(
      formatShippingAddress({
        addressLine1: "12 MG Road",
        city: "Doha",
        state: "Doha",
        pincode: "12345",
        country: "Qatar",
      }),
      "12 MG Road, Doha, Doha, 12345, Qatar"
    );
  });
});

describe("formatStreetLine / formatLocalityLine — component lines", () => {
  it("combines line 1 with the landmark line 2", () => {
    assert.strictEqual(
      formatStreetLine({ addressLine1: "42 Park Street", addressLine2: "Sector 21" }),
      "42 Park Street, Sector 21"
    );
  });

  it("drops a missing landmark without a stray comma", () => {
    assert.strictEqual(formatStreetLine({ addressLine1: "42 Park Street" }), "42 Park Street");
  });

  it("joins city, state and pincode", () => {
    assert.strictEqual(
      formatLocalityLine({ city: "Noida", state: "Uttar Pradesh", pincode: "201301" }),
      "Noida, Uttar Pradesh, 201301"
    );
  });
});

describe("formatShippingAddressLines — Track Order stacked rendering", () => {
  it("returns every part on its own line for a complete address", () => {
    const lines = formatShippingAddressLines({
      name: "Rahul Sharma",
      phone: "+91 95263 09490",
      addressLine1: "42 Park Street",
      addressLine2: "Sector 21",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
      country: "India",
    });
    assert.deepStrictEqual(lines, [
      "Rahul Sharma",
      "42 Park Street, Sector 21",
      "Noida, Uttar Pradesh, 201301",
      "India",
      "+91 95263 09490",
    ]);
    assertCleanLines(lines);
  });

  it("omits missing optional parts (landmark, country, phone) with no blanks", () => {
    const lines = formatShippingAddressLines({
      name: "Rahul Sharma",
      addressLine1: "42 Park Street",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
    });
    assert.deepStrictEqual(lines, [
      "Rahul Sharma",
      "42 Park Street",
      "Noida, Uttar Pradesh, 201301",
    ]);
    assertCleanLines(lines);
  });

  it("supports excluding the name (Track Order masks it separately)", () => {
    const lines = formatShippingAddressLines(
      { name: "Rahul Sharma", addressLine1: "42 Park Street", city: "Noida" },
      { includeName: false }
    );
    assert.deepStrictEqual(lines, ["42 Park Street", "Noida"]);
  });

  it("keeps a long address intact without truncation", () => {
    const longLine = `Flat ${"A".repeat(180)}`;
    const lines = formatShippingAddressLines({
      name: "Rahul Sharma",
      addressLine1: longLine,
      city: "Noida",
      country: "United Arab Emirates",
    });
    assert.ok(lines.includes(longLine));
    assertCleanLines(lines);
  });

  it("returns no lines for null, undefined or blank snapshots", () => {
    assert.deepStrictEqual(formatShippingAddressLines(null), []);
    assert.deepStrictEqual(formatShippingAddressLines(undefined), []);
    assert.deepStrictEqual(
      formatShippingAddressLines({ name: "  ", phone: "", city: "", state: " " }),
      []
    );
  });

  it("never emits null or undefined for a partial snapshot", () => {
    const lines = formatShippingAddressLines({ city: "Noida" });
    assertCleanLines(lines);
  });
});
