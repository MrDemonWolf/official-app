import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/hooks/query-keys';
import { getCategories } from '@/services/wordpress';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30,
  });
}
