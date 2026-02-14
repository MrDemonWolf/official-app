import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/hooks/query-keys';
import {
  addBookmark,
  getBookmarks,
  isBookmarked as checkIsBookmarked,
  removeBookmark,
} from '@/services/bookmarks';
import type { BookmarkedPost } from '@/types/bookmark';

export function useBookmarks(type?: string) {
  return useQuery({
    queryKey: queryKeys.bookmarks(type),
    queryFn: () => getBookmarks(type),
  });
}

export function useIsBookmarked(postId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.isBookmarked(postId ?? 0),
    queryFn: () => checkIsBookmarked(postId!),
    enabled: !!postId,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (bookmark: Omit<BookmarkedPost, 'id' | 'bookmarked_at'>) => addBookmark(bookmark),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.isBookmarked(variables.post_id) });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (postId: number) => removeBookmark(postId),
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.isBookmarked(postId) });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  return { addBookmark: addMutation, removeBookmark: removeMutation };
}
