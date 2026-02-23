import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/hooks/query-keys';
import { getPortfolioCategories, getPortfolioItem, getPortfolioItems } from '@/services/portfolio';

export function usePortfolioItems(perPage: number = 10) {
  return useInfiniteQuery({
    queryKey: queryKeys.portfolioItems,
    queryFn: ({ pageParam = 1 }) => getPortfolioItems(pageParam, perPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function usePortfolioCategories() {
  return useQuery({
    queryKey: queryKeys.portfolioCategories,
    queryFn: getPortfolioCategories,
    staleTime: 1000 * 60 * 30,
  });
}

export function usePortfolioItem(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.portfolioItem(id || ''),
    queryFn: () => getPortfolioItem(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
