import type { WPPost } from '@/types/wordpress';

interface FeaturedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export function getFeaturedImage(post: WPPost): FeaturedImage | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;

  const sizes = media.media_details?.sizes;

  // Prefer medium_large (768px), then medium, then full source_url
  const preferred = sizes?.medium_large ?? sizes?.medium;

  if (preferred) {
    return {
      url: preferred.source_url,
      alt: media.alt_text || '',
      width: preferred.width,
      height: preferred.height,
    };
  }

  if (media.source_url) {
    return {
      url: media.source_url,
      alt: media.alt_text || '',
      width: media.media_details?.width ?? 0,
      height: media.media_details?.height ?? 0,
    };
  }

  return null;
}
