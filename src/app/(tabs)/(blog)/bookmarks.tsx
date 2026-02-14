import { Link } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ImpactFeedbackStyle } from 'expo-haptics';

import { useBookmarks } from '@/hooks/use-bookmarks';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHaptics } from '@/hooks/use-haptics';
import type { BookmarkedPost } from '@/types/bookmark';

function BookmarkItem({ item }: { item: BookmarkedPost }) {
  const haptics = useHaptics();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = useCallback(() => {
    haptics.impact(ImpactFeedbackStyle.Light);
  }, [haptics]);

  const href = item.post_type === 'portfolio'
    ? `/portfolio/${item.post_id}`
    : `/blog/${item.post_id}`;

  return (
    <Link href={href as any} asChild>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          gap: 12,
          padding: 12,
          borderRadius: 12,
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          opacity: pressed ? 0.8 : 1,
          borderCurve: 'continuous',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        })}
      >
        {item.featured_image_url && (
          <Image
            source={{ uri: item.featured_image_url }}
            style={{ width: 80, height: 60, borderRadius: 8 }}
            contentFit="cover"
          />
        )}
        <View style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: isDark ? '#f4f4f5' : '#18181b',
            }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: isDark ? '#71717a' : '#a1a1aa',
              textTransform: 'capitalize',
            }}
          >
            {item.post_type}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

export default function BookmarksScreen() {
  const { data: bookmarks, isLoading, refetch, isRefetching } = useBookmarks();
  const haptics = useHaptics();

  const handleRefresh = useCallback(async () => {
    await refetch();
    haptics.notification();
  }, [refetch, haptics]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={bookmarks}
      keyExtractor={(item) => item.post_id.toString()}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 12 }}
      className="bg-zinc-50 dark:bg-zinc-950"
      renderItem={({ item }) => <BookmarkItem item={item} />}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center p-8" style={{ paddingTop: 60 }}>
          <Text
            className="text-center text-base text-zinc-500"
            style={{ lineHeight: 24 }}
          >
            No bookmarks yet. Tap the bookmark icon on any post to save it for later.
          </Text>
        </View>
      }
    />
  );
}
