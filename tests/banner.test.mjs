import { describe, it } from "node:test";
import assert from "node:assert";

function isBannerVisible(banner, now = Date.now()) {
  if (!banner.isActive) return false;
  const start = new Date(banner.startDate).getTime();
  const end = new Date(banner.endDate).getTime();
  return now >= start && now < end;
}

const FUTURE = "2099-01-01T00:00:00.000Z";
const PAST = "2020-01-01T00:00:00.000Z";
const MID = "2025-06-15T12:00:00.000Z";

describe("isBannerVisible", () => {
  it("returns true for an active banner whose window includes now", () => {
    const banner = { isActive: true, startDate: PAST, endDate: FUTURE };
    assert.strictEqual(isBannerVisible(banner, new Date(MID).getTime()), true);
  });

  it("returns false when isActive is false", () => {
    const banner = { isActive: false, startDate: PAST, endDate: FUTURE };
    assert.strictEqual(isBannerVisible(banner, new Date(MID).getTime()), false);
  });

  it("returns false when now is before startDate", () => {
    const banner = { isActive: true, startDate: FUTURE, endDate: FUTURE };
    assert.strictEqual(isBannerVisible(banner, new Date(PAST).getTime()), false);
  });

  it("returns false when now is on or after endDate", () => {
    const banner = { isActive: true, startDate: PAST, endDate: MID };
    assert.strictEqual(isBannerVisible(banner, new Date(MID).getTime()), false);
  });

  it("returns true exactly at startDate boundary", () => {
    const banner = { isActive: true, startDate: MID, endDate: FUTURE };
    assert.strictEqual(isBannerVisible(banner, new Date(MID).getTime()), true);
  });
});
