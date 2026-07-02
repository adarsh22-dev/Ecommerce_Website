import { describe, expect, it } from "vitest";
import { mergeProductMedia } from "./product-content";

describe("mergeProductMedia", () => {
  it("prefers backend content images and videos when they are provided", () => {
    const result = mergeProductMedia(
      [{ image_url: "/fallback.jpg", alt_text: "Fallback" }],
      {
        images: ["/backend-1.jpg", "/backend-2.jpg"],
        videos: [{ id: "v1", video_url: "https://example.com/video.mp4", thumbnail_url: "/thumb.jpg", title: "Launch teaser" }],
      }
    );

    expect(result.images.map((image) => image.image_url)).toEqual(["/backend-1.jpg", "/backend-2.jpg"]);
    expect(result.videos[0].title).toBe("Launch teaser");
  });

  it("falls back to the product images when no backend media exists", () => {
    const result = mergeProductMedia([{ image_url: "/fallback.jpg", alt_text: "Fallback" }], undefined);

    expect(result.images).toHaveLength(1);
    expect(result.images[0].image_url).toBe("/fallback.jpg");
    expect(result.videos).toEqual([]);
  });
});
