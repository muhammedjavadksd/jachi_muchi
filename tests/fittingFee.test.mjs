import { describe, it } from "node:test";
import assert from "node:assert";
import { getEffectiveFittingFee } from "../src/shared/utils/fittingFee.ts";

describe("fitting fee display helper", () => {
  it("passes the server's fee through unchanged", () => {
    assert.strictEqual(getEffectiveFittingFee(299), 299);
    assert.strictEqual(getEffectiveFittingFee("299"), 299);
  });

  it("never returns a negative, missing or non-numeric fee", () => {
    assert.strictEqual(getEffectiveFittingFee(-50), 0);
    assert.strictEqual(getEffectiveFittingFee(null), 0);
    assert.strictEqual(getEffectiveFittingFee(undefined), 0);
    assert.strictEqual(getEffectiveFittingFee("abc"), 0);
  });
});
