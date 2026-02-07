import { Link } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { BlogPostCard } from '@/components/blog-post-card';
import { queryKeys } from '@/hooks/query-keys';
import { useHaptics } from '@/hooks/use-haptics';
import { usePosts } from '@/hooks/use-posts';

export default function BlogScreen() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = usePosts();
  const haptics = useHaptics();
  const queryClient = useQueryClient();

  const posts = useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data?.pages]);

  // Pre-populate individual post caches so detail screens render instantly
  useEffect(() => {
    for (const post of posts) {
      queryClient.setQueryData(queryKeys.post(post.id.toString()), post);
    }
  }, [posts, queryClient]);

  const handleRefresh = useCallback(async () => {
    await refetch();
    haptics.notification();
  }, [refetch, haptics]);

  if (isLoading && posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-5 dark:bg-zinc-950">
        <Text className="text-center text-base text-zinc-900 dark:text-zinc-100" selectable>
          Failed to load posts. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 16 }}
      className="bg-zinc-50 dark:bg-zinc-950"
      renderItem={({ item }) => (
        <Link href={`/blog/${item.id}`} asChild>
          <BlogPostCard post={item} />
        </Link>
      )}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="items-center p-5">
            <ActivityIndicator size="small" />
          </View>
        ) : null
      }
      ListEmptyComponent={
        <View className="items-center p-5">
          <Text className="text-base text-zinc-500">No posts found.</Text>
        </View>
      }
    />
  );
}
