import { useInfiniteQuery } from '@tanstack/react-query';

import { queryKeys } from '@/hooks/query-keys';
import { searchPosts } from '@/services/wordpress';

export function useSearchPosts(query: string, perPage: number = 10) {
  return useInfiniteQuery({
    queryKey: queryKeys.searchPosts(query),
    queryFn: ({ pageParam = 1 }) => searchPosts(query, pageParam, perPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 2,
  });
}
