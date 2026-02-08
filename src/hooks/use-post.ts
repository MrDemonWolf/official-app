import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/hooks/query-keys';
import { getPost } from '@/services/wordpress';

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.post(id || ''),
    queryFn: () => getPost(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
