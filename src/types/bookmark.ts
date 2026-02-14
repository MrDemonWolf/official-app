export interface BookmarkedPost {
  id: number;
  post_id: number;
  post_type: string;
  title: string;
  excerpt: string;
  featured_image_url: string | null;
  content_html: string;
  author_name: string | null;
  date: string;
  bookmarked_at: string;
  link: string;
}
