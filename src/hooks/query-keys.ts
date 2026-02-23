export const queryKeys = {
  user: ['user'] as const,
  posts: ['posts'] as const,
  post: (id: string) => ['post', id] as const,
  portfolioItems: ['portfolio-items'] as const,
  portfolioItem: (id: string) => ['portfolio-item', id] as const,
  searchPosts: (query: string) => ['search-posts', query] as const,
  categories: ['categories'] as const,
  bookmarks: (type?: string) => ['bookmarks', type] as const,
  isBookmarked: (postId: number) => ['is-bookmarked', postId] as const,
};
