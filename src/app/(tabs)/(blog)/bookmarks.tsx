import { Link } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics';

import { PlatformIcon } from '@/components/platform-icon';
import { useBookmarks, useToggleBookmark } from '@/hooks/use-bookmarks';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHaptics } from '@/hooks/use-haptics';
import type { BookmarkedPost } from '@/types/bookmark';

function BookmarkItem({ item }: { item: BookmarkedPost }) {
  const haptics = useHaptics();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { removeBookmark } = useToggleBookmark();

  const handlePress = useCallback(() => {
    haptics.impact(ImpactFeedbackStyle.Light);
  }, [haptics]);

  const handleRemove = useCallback(() => {
    haptics.notification(NotificationFeedbackType.Warning);
    Alert.alert('Remove Bookmark', `Remove "${item.title}" from bookmarks?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeBookmark.mutate(item.post_id),
      },
    ]);
  }, [haptics, item, removeBookmark]);

  const href = item.post_type === 'portfolio'
    ? `/portfolio/${item.post_id}`
    : `/blog/${item.post_id}`;

  const date = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={href as any} asChild>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.post_type}, ${date}`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          gap: 12,
          padding: 12,
          borderRadius: 12,
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          opacity: pressed ? 0.8 : 1,
          borderCurve: 'continuous',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          alignItems: 'center',
        })}
      >
        {item.featured_image_url ? (
          <Image
            source={{ uri: item.featured_image_url }}
            style={{ width: 72, height: 72, borderRadius: 10 }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 10,
              backgroundColor: isDark ? '#27272a' : '#f4f4f5',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlatformIcon
              name="doc.text"
              size={24}
              tintColor={isDark ? '#52525b' : '#a1a1aa'}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
          </View>
        )}
        <View style={{ flex: 1, gap: 4 }}>
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
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 12,
                color: isDark ? '#52525b' : '#a1a1aa',
                textTransform: 'capitalize',
              }}
            >
              {item.post_type}
            </Text>
            <Text style={{ fontSize: 12, color: isDark ? '#52525b' : '#d4d4d8' }}>
              {'|'}
            </Text>
            <Text style={{ fontSize: 12, color: isDark ? '#52525b' : '#a1a1aa' }}>
              {date}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={handleRemove}
          accessibilityRole="button"
          accessibilityLabel={`Remove bookmark for ${item.title}`}
          style={({ pressed }) => ({
            minWidth: 44,
            minHeight: 44,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.4 : 1,
          })}
        >
          <PlatformIcon
            name="bookmark.fill"
            size={18}
            tintColor="#3b82f6"
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          />
        </Pressable>
      </Pressable>
    </Link>
  );
}

export default function BookmarksScreen() {
  const { data: bookmarks, isLoading, refetch, isRefetching } = useBookmarks();
  const haptics = useHaptics();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
      contentContainerStyle={{ padding: 16, gap: 10 }}
      className="bg-zinc-50 dark:bg-zinc-950"
      renderItem={({ item }) => <BookmarkItem item={item} />}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
      ListEmptyComponent={
        <View style={{ alignItems: 'center', paddingTop: 80, paddingHorizontal: 32, gap: 12 }}>
          <PlatformIcon
            name="bookmark"
            size={48}
            tintColor={isDark ? '#3f3f46' : '#d4d4d8'}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: isDark ? '#71717a' : '#a1a1aa',
              textAlign: 'center',
            }}
          >
            No Bookmarks
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: isDark ? '#52525b' : '#a1a1aa',
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            Tap the bookmark icon on any post or portfolio item to save it for later reading.
          </Text>
        </View>
      }
    />
  );
}
