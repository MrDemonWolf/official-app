import { Image } from 'expo-image';
import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { HtmlContent } from '@/components/html-content';
import { PlatformIcon } from '@/components/platform-icon';
import { useIsBookmarked, useToggleBookmark } from '@/hooks/use-bookmarks';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHaptics } from '@/hooks/use-haptics';
import { usePost } from '@/hooks/use-post';
import { useShare } from '@/hooks/use-share';
import { decodeHtmlEntities } from '@/lib/decode-html';
import { getFeaturedImage } from '@/lib/wordpress-helpers';
import { getBookmarkedContent } from '@/services/bookmarks';
import type { BookmarkedPost } from '@/types/bookmark';

export default function BlogPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = id ? parseInt(id, 10) : undefined;
  const { data: post, isLoading, error } = usePost(id);
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { shareContent } = useShare();
  const haptics = useHaptics();

  // Bookmark hooks — always called before any returns
  const { data: bookmarked } = useIsBookmarked(postId);
  const { addBookmark, removeBookmark } = useToggleBookmark();

  // Offline fallback
  const [offlinePost, setOfflinePost] = useState<BookmarkedPost | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (error && id) {
      getBookmarkedContent(parseInt(id, 10)).then((cached) => {
        if (cached) {
          setOfflinePost(cached);
          setIsOffline(true);
        }
      });
    }
  }, [error, id]);

  // Normalize data — compute from whichever source is available
  const resolved = useMemo(() => {
    if (post) {
      return {
        title: decodeHtmlEntities(post.title.rendered),
        dateStr: post.date,
        contentHtml: post.content.rendered,
        featuredImage: getFeaturedImage(post),
        offlineFeaturedUrl: null as string | null,
        postLink: post.link,
        authorName: post._embedded?.author?.[0]?.name || null,
        excerpt: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '')).slice(0, 150),
        postId: post.id,
      };
    }
    if (offlinePost) {
      return {
        title: offlinePost.title,
        dateStr: offlinePost.date,
        contentHtml: offlinePost.content_html,
        featuredImage: null,
        offlineFeaturedUrl: offlinePost.featured_image_url,
        postLink: offlinePost.link,
        authorName: offlinePost.author_name,
        excerpt: offlinePost.excerpt,
        postId: offlinePost.post_id,
      };
    }
    return null;
  }, [post, offlinePost]);

  const handleShare = useCallback(() => {
    if (resolved) {
      shareContent(resolved.title, resolved.postLink);
    }
  }, [shareContent, resolved]);

  const handleBookmark = useCallback(() => {
    if (!resolved) return;
    if (bookmarked) {
      haptics.impact(ImpactFeedbackStyle.Light);
      removeBookmark.mutate(resolved.postId);
    } else {
      haptics.notification(NotificationFeedbackType.Success);
      addBookmark.mutate({
        post_id: resolved.postId,
        post_type: 'post',
        title: resolved.title,
        excerpt: resolved.excerpt,
        featured_image_url: resolved.featuredImage?.url || resolved.offlineFeaturedUrl || null,
        content_html: resolved.contentHtml,
        author_name: resolved.authorName,
        date: resolved.dateStr,
        link: resolved.postLink,
      });
    }
  }, [resolved, bookmarked, haptics, addBookmark, removeBookmark]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!resolved) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-5 dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Error' }} />
        <Text className="text-center text-base text-zinc-900 dark:text-zinc-100" selectable>
          Failed to load post. Please try again later.
        </Text>
      </View>
    );
  }

  const {
    title, dateStr, contentHtml, featuredImage, offlineFeaturedUrl,
  } = resolved;
  const date = new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Android header with PlatformIcon buttons (maps to MaterialIcons)
  const headerRight = () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Pressable
        onPress={handleShare}
        accessibilityRole="button"
        accessibilityLabel="Share"
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
      >
        <PlatformIcon name="square.and.arrow.up" size={24} tintColor={isDark ? '#f4f4f5' : '#18181b'} />
      </Pressable>
      <Pressable
        onPress={handleBookmark}
        accessibilityRole="button"
        accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
      >
        <PlatformIcon
          name={bookmarked ? 'bookmark.fill' : 'bookmark'}
          size={24}
          tintColor={isDark ? '#f4f4f5' : '#18181b'}
        />
      </Pressable>
    </View>
  );

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="bg-zinc-50 dark:bg-zinc-950"
      >
        {/* Offline banner */}
        {isOffline && (
          <View
            style={{
              padding: 10,
              backgroundColor: isDark ? '#422006' : '#fef3c7',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 13, color: isDark ? '#fbbf24' : '#92400e' }}>
              Viewing saved copy — you appear to be offline
            </Text>
          </View>
        )}

        {featuredImage && (
          <Image
            source={{ uri: featuredImage.url }}
            style={{
              width,
              aspectRatio:
                featuredImage.width && featuredImage.height
                  ? featuredImage.width / featuredImage.height
                  : 16 / 9,
            }}
            contentFit="cover"
            alt={featuredImage.alt}
          />
        )}
        {!featuredImage && offlineFeaturedUrl && (
          <Image
            source={{ uri: offlineFeaturedUrl }}
            style={{ width, aspectRatio: 16 / 9 }}
            contentFit="cover"
          />
        )}
        <View style={{ padding: 16, gap: 16, maxWidth: 680, alignSelf: 'center', width: '100%' }}>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">{date}</Text>
          <HtmlContent html={contentHtml} />
        </View>
      </ScrollView>
      <Stack.Screen options={{ title, headerRight }} />
    </>
  );
}
