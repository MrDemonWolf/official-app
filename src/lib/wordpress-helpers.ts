interface FeaturedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export function getFeaturedImage(item: { _embedded?: any }): FeaturedImage | null {
  const media = item._embedded?.['wp:featuredmedia']?.[0];
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

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
