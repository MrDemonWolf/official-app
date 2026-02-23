import type { WPPortfolioItem, WPPortfolioResponse } from '@/types/portfolio';
import type { WPCategory } from '@/types/wordpress';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_WORDPRESS_API_URL || 'https://hotpink-jaguar-740254.hostingersite.com/wp-json/wp/v2';

export async function getPortfolioItems(
  page: number = 1,
  perPage: number = 10
): Promise<WPPortfolioResponse> {
  const response = await fetch(
    `${API_BASE_URL}/project?page=${page}&per_page=${perPage}&_embed`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio items: ${response.statusText}`);
  }

  const items: WPPortfolioItem[] = await response.json();
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
  const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);

  return { items, totalPages, total };
}

// Fetch project_category taxonomy — same shape as WP categories
export async function getPortfolioCategories(): Promise<WPCategory[]> {
  const response = await fetch(`${API_BASE_URL}/project_category?per_page=100`);

  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio categories: ${response.statusText}`);
  }

  return response.json();
}

export async function getPortfolioItem(id: string): Promise<WPPortfolioItem> {
  const response = await fetch(`${API_BASE_URL}/project/${id}?_embed`);

  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio item: ${response.statusText}`);
  }

  return response.json();
}
