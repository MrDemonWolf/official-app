// Type definitions for WordPress REST API (partial, focused on fields used by the app)
export type WP_Term = {
  id: number
  link?: string
  name: string
  slug?: string
  taxonomy?: string
}

export type WP_Media = {
  id: number
  source_url?: string
  media_details?: any
  alt_text?: string
}

export type WP_Post = {
  id: number
  date?: string
  slug?: string
  title?: { rendered?: string }
  excerpt?: { rendered?: string }
  content?: { rendered?: string }
  link?: string
  _embedded?: {
    'wp:featuredmedia'?: WP_Media[]
    'wp:term'?: WP_Term[][]
  }
  [key: string]: any
}

export type FetchPostsResult = {
  posts: WP_Post[]
  totalPages: number
  total: number
}

export default {} as any
