import type {
  WPCategory,
  WPPost,
  WPPostsResponse,
  WPUser,
} from '@/types/wordpress';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_WORDPRESS_API_URL || 'https://mrdemonwolf.com/wp-json/wp/v2';

const WORDPRESS_USER_ID = process.env.EXPO_PUBLIC_WORDPRESS_USER_ID || '1';

export async function getUser(): Promise<WPUser> {
  const response = await fetch(`${API_BASE_URL}/users/${WORDPRESS_USER_ID}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json();
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

export async function searchPosts(
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<WPPostsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/posts?search=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&_embed`
  );

  if (!response.ok) {
    throw new Error(`Failed to search posts: ${response.statusText}`);
  }

  const posts: WPPost[] = await response.json();
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
  const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);

  return { posts, totalPages, total };
}

export async function getCategories(): Promise<WPCategory[]> {
  const response = await fetch(`${API_BASE_URL}/categories?per_page=100`);

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}
