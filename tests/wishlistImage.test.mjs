import { describe, it } from "node:test";
import assert from "node:assert";
import {
  IMAGE_PLACEHOLDER,
  pickPrimaryImage,
  resolveImageSrc,
  nextImageSrcOnError,
} from "../src/shared/utils/imageSrc.ts";

const API_ORIGIN = "http://localhost:5000";

describe("resolveImageSrc — wishlist image sources", () => {
  it("returns a valid absolute image URL unchanged", () => {
    const url = "https://cdn.example.com/products/frame.jpg";
    assert.strictEqual(resolveImageSrc(url, API_ORIGIN), url);
  });

  it("prefixes a site-relative upload path with the API origin", () => {
    assert.strictEqual(
      resolveImageSrc("/uploads/products/frame.jpg", API_ORIGIN),
      `${API_ORIGIN}/uploads/products/frame.jpg`
    );
  });

  it("falls back to the placeholder when the image is null or empty", () => {
    assert.strictEqual(resolveImageSrc(null, API_ORIGIN), IMAGE_PLACEHOLDER);
    assert.strictEqual(resolveImageSrc(undefined, API_ORIGIN), IMAGE_PLACEHOLDER);
    assert.strictEqual(resolveImageSrc("", API_ORIGIN), IMAGE_PLACEHOLDER);
    assert.strictEqual(resolveImageSrc("   ", API_ORIGIN), IMAGE_PLACEHOLDER);
  });
});

describe("nextImageSrcOnError — broken URL fallback", () => {
  it("swaps a broken (failed) source for the placeholder", () => {
    assert.strictEqual(
      nextImageSrcOnError("https://cdn.example.com/missing.jpg"),
      IMAGE_PLACEHOLDER
    );
  });

  it("keeps the placeholder to avoid an endless error loop", () => {
    assert.strictEqual(nextImageSrcOnError(IMAGE_PLACEHOLDER), IMAGE_PLACEHOLDER);
  });
});

describe("pickPrimaryImage — multiple images", () => {
  it("prefers the resolved single image field", () => {
    assert.strictEqual(
      pickPrimaryImage({ image: "https://cdn.example.com/primary.jpg", images: ["https://cdn.example.com/secondary.jpg"] }),
      "https://cdn.example.com/primary.jpg"
    );
  });

  it("uses the first entry when only an images array is present", () => {
    assert.strictEqual(
      pickPrimaryImage({ images: ["https://cdn.example.com/a.jpg", "https://cdn.example.com/b.jpg"] }),
      "https://cdn.example.com/a.jpg"
    );
  });

  it("skips empty entries and holes in the gallery", () => {
    assert.strictEqual(
      pickPrimaryImage({ images: ["", "  ", "https://cdn.example.com/real.jpg"] }),
      "https://cdn.example.com/real.jpg"
    );
  });

  it("returns undefined when there is no usable image", () => {
    assert.strictEqual(pickPrimaryImage({ images: [] }), undefined);
    assert.strictEqual(pickPrimaryImage(null), undefined);
  });
});
