import { useInfiniteQuery } from '@tanstack/react-query';

import { queryKeys } from '@/hooks/query-keys';
import { getPosts } from '@/services/wordpress';

export function usePosts(perPage: number = 10) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts,
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam, perPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
