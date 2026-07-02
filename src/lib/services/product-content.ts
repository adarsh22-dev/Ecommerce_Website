export interface ProductContentMedia {
  images?: string[];
  videos?: Array<{
    id?: string;
    video_url: string;
    thumbnail_url?: string | null;
    title?: string | null;
    description?: string | null;
  }>;
}

export interface ProductGalleryImage {
  id: string;
  image_url: string;
  alt_text?: string | null;
}

export interface ProductGalleryVideo {
  id: string;
  video_url: string;
  thumbnail_url?: string | null;
  title?: string | null;
  description?: string | null;
}

const PRODUCT_CONTENT_STORAGE_KEY = "ecom:product-content";

function readStoredProductContent(): Record<string, ProductContentMedia> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PRODUCT_CONTENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStoredProductContent(contentMap: Record<string, ProductContentMedia>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRODUCT_CONTENT_STORAGE_KEY, JSON.stringify(contentMap));
}

export async function getProductMediaForSlug(slug: string): Promise<ProductContentMedia | undefined> {
  return readStoredProductContent()[slug];
}

export async function saveProductContent(slug: string, content: ProductContentMedia) {
  const contentMap = readStoredProductContent();
  contentMap[slug] = content;
  writeStoredProductContent(contentMap);
  return content;
}

export function mergeProductMedia(
  productImages: Array<{ image_url: string; alt_text?: string | null }>,
  content?: ProductContentMedia
) {
  const images = (content?.images && content.images.length > 0
    ? content.images
    : productImages.map((image) => image.image_url)
  ).map((imageUrl, index) => ({
    id: `media-${index + 1}`,
    image_url: imageUrl,
    alt_text: productImages[index]?.alt_text ?? null,
  }));

  const videos = (content?.videos ?? [])
    .filter((video) => Boolean(video.video_url))
    .map((video, index) => ({
      id: video.id ?? `video-${index + 1}`,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url ?? null,
      title: video.title ?? "Product highlight",
      description: video.description ?? null,
    }));

  return { images, videos };
}
