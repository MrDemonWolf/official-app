import type { WPMedia, WPPage, WPPost, WPPostsResponse } from '@/types/wordpress';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_WORDPRESS_API_URL || 'https://mrdemonwolf.com/wp-json/wp/v2';

export async function getAboutPage(): Promise<WPPage | null> {
  const response = await fetch(`${API_BASE_URL}/pages?slug=about`);

  if (!response.ok) {
    throw new Error(`Failed to fetch about page: ${response.statusText}`);
  }

  const pages: WPPage[] = await response.json();
  return pages.length > 0 ? pages[0] : null;
}

export async function getPosts(page: number = 1, perPage: number = 10): Promise<WPPostsResponse> {
  const response = await fetch(`${API_BASE_URL}/posts?page=${page}&per_page=${perPage}&_embed`);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  const posts: WPPost[] = await response.json();
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
  const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);

  return { posts, totalPages, total };
}

export async function getPost(id: string): Promise<WPPost> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}?_embed`);

  if (!response.ok) {
    throw new Error(`Failed to fetch post: ${response.statusText}`);
  }

  return response.json();
}

export async function getMedia(id: number): Promise<WPMedia> {
  const response = await fetch(`${API_BASE_URL}/media/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.statusText}`);
  }

  return response.json();
}
