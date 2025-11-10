export interface WordPressPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  link: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
      alt_text?: string;
    }[];
  };
}

const WORDPRESS_URL = process.env.EXPO_PUBLIC_WORDPRESS_URL || '';
const POSTS_PER_PAGE = 10;

export async function fetchBlogPosts(page: number = 1): Promise<WordPressPost[]> {
  if (!WORDPRESS_URL) {
    throw new Error('EXPO_PUBLIC_WORDPRESS_URL is not configured');
  }

  try {
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&per_page=${POSTS_PER_PAGE}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}
