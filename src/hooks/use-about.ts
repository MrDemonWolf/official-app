import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/hooks/query-keys';
import { getUser } from '@/services/wordpress';

export function useAbout() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: getUser,
    staleTime: 1000 * 60 * 5,
  });
}
