import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/hooks/query-keys';
import { getAboutPage } from '@/services/wordpress';

export function useAbout() {
  return useQuery({
    queryKey: queryKeys.aboutPage,
    queryFn: getAboutPage,
    staleTime: 1000 * 60 * 5,
  });
}
