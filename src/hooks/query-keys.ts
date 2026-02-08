export const queryKeys = {
  aboutPage: ['about-page'] as const,
  posts: ['posts'] as const,
  post: (id: string) => ['post', id] as const,
  media: (id: number) => ['media', id] as const,
};
