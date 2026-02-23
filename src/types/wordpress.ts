export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPPost {
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
  categories: number[];
  tags: number[];
  _embedded?: WPEmbedded;
}

export interface WPPage {
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
  parent: number;
  menu_order: number;
  _embedded?: WPEmbedded;
}

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: WPRendered;
  author: number;
  caption: WPRendered;
  alt_text: string;
  media_type: string;
  mime_type: string;
  source_url: string;
  media_details: {
    width: number;
    height: number;
    sizes: Record<
      string,
      {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      }
    >;
  };
}

export interface WPMediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

export interface WPEmbeddedFeaturedMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes: Record<string, WPMediaSize>;
  };
}

export interface WPSocialLink {
  platform: string;
  url: string;
  icon_url?: string;
  label?: string;
}

export interface WPAuthorAcf {
  role_title?: string;
  social_links?: WPSocialLink[];
}

export interface WPUser {
  id: number;
  name: string;
  slug: string;
  description?: string;
  url?: string;
  avatar_urls?: Record<string, string>;
  acf?: WPAuthorAcf;
}

export interface WPEmbeddedAuthor {
  id: number;
  name: string;
  slug: string;
  description?: string;
  url?: string;
  avatar_urls?: Record<string, string>;
  acf?: WPAuthorAcf;
}

export interface WPEmbeddedTerm {
  id: number;
  name: string;
  slug: string;
}

export interface WPEmbedded {
  'wp:featuredmedia'?: WPEmbeddedFeaturedMedia[];
  author?: WPEmbeddedAuthor[];
  'wp:term'?: WPEmbeddedTerm[][];
}

export interface WPPostsResponse {
  posts: WPPost[];
  totalPages: number;
  total: number;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  parent: number;
}
