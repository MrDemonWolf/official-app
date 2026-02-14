import type { WPEmbedded, WPRendered } from './wordpress';

export interface WPPortfolioItem {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  author: number;
  featured_media: number;
  _embedded?: WPEmbedded;
  acf?: {
    project_url?: string;
    technologies?: string;
    client?: string;
  };
}

export interface WPPortfolioResponse {
  items: WPPortfolioItem[];
  totalPages: number;
  total: number;
}
