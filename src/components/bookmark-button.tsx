import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { useCallback } from 'react';
import { Pressable } from 'react-native';

import { useHaptics } from '@/hooks/use-haptics';
import { useIsBookmarked, useToggleBookmark } from '@/hooks/use-bookmarks';
import type { BookmarkedPost } from '@/types/bookmark';

interface BookmarkButtonProps {
  postId: number;
  postType: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  contentHtml: string;
  authorName: string | null;
  date: string;
  link: string;
  tintColor?: string;
  size?: number;
}

export function BookmarkButton({
  postId,
  postType,
  title,
  excerpt,
  featuredImageUrl,
  contentHtml,
  authorName,
  date,
  link,
  tintColor = '#3b82f6',
  size = 22,
}: BookmarkButtonProps) {
  const { data: bookmarked } = useIsBookmarked(postId);
  const { addBookmark, removeBookmark } = useToggleBookmark();
  const haptics = useHaptics();

  const handlePress = useCallback(() => {
    if (bookmarked) {
      haptics.impact(ImpactFeedbackStyle.Light);
      removeBookmark.mutate(postId);
    } else {
      haptics.notification(NotificationFeedbackType.Success);
      const bookmark: Omit<BookmarkedPost, 'id' | 'bookmarked_at'> = {
        post_id: postId,
        post_type: postType,
        title,
        excerpt,
        featured_image_url: featuredImageUrl,
        content_html: contentHtml,
        author_name: authorName,
        date,
        link,
      };
      addBookmark.mutate(bookmark);
    }
  }, [bookmarked, postId, postType, title, excerpt, featuredImageUrl, contentHtml, authorName, date, link, haptics, addBookmark, removeBookmark]);

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => ({
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <SymbolView
        name={bookmarked ? 'bookmark.fill' : 'bookmark'}
        size={size}
        tintColor={tintColor}
        resizeMode="scaleAspectFit"
      />
    </Pressable>
  );
}
