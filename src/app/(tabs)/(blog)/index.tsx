import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';

import { BlogPostCard } from '@/components/blog-post-card';
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

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

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
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
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
