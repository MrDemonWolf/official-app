import { Link, router, Stack } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { BlogPostCard } from '@/components/blog-post-card';
import { PlatformIcon } from '@/components/platform-icon';
import { CategoryFilter } from '@/components/category-filter';
import { useCategories } from '@/hooks/use-categories';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryKeys } from '@/hooks/query-keys';
import { useHaptics } from '@/hooks/use-haptics';
import { usePosts } from '@/hooks/use-posts';
import { useSearchPosts } from '@/hooks/use-search-posts';

const isIOS = process.env.EXPO_OS === 'ios';

export default function BlogScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isSearching = debouncedQuery.length > 0;

  const postsQuery = usePosts();
  const searchResults = useSearchPosts(debouncedQuery);
  const { data: categories } = useCategories();

  const activeQuery = isSearching ? searchResults : postsQuery;
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = activeQuery;

  const haptics = useHaptics();
  const queryClient = useQueryClient();

  const allPosts = useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data?.pages]);

  // Filter by category if selected
  const posts = useMemo(() => {
    if (!selectedCategory) return allPosts;
    return allPosts.filter((p) => p.categories?.includes(selectedCategory));
  }, [allPosts, selectedCategory]);

  useEffect(() => {
    for (const post of allPosts) {
      queryClient.setQueryData(queryKeys.post(post.id.toString()), post);
    }
  }, [allPosts, queryClient]);

  const handleRefresh = useCallback(async () => {
    await refetch();
    haptics.notification();
  }, [refetch, haptics]);

  const androidHeaderRight = !isIOS
    ? () => (
        <Pressable
          onPress={() => router.push('/bookmarks' as any)}
          accessibilityRole="button"
          accessibilityLabel="Bookmarks"
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
        >
          <PlatformIcon
            name="bookmark"
            size={24}
            tintColor={isDark ? '#f4f4f5' : '#18181b'}
          />
        </Pressable>
      )
    : undefined;

  const ListHeader = useMemo(() => {
    return (
      <View style={{ gap: 12 }}>
        {/* Android search bar */}
        {!isIOS && (
          <TextInput
            placeholder="Search posts..."
            placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              fontSize: 16,
              padding: 12,
              borderRadius: 10,
              backgroundColor: isDark ? '#18181b' : '#ffffff',
              color: isDark ? '#f4f4f5' : '#18181b',
            }}
          />
        )}

        {/* Category filter */}
        {categories && categories.length > 0 && !isSearching && (
          <CategoryFilter
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}
      </View>
    );
  }, [isDark, searchQuery, categories, selectedCategory, isSearching]);

  if (isLoading && posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Blog', headerRight: androidHeaderRight }} />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-5 dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Blog', headerRight: androidHeaderRight }} />
        <Text className="text-center text-base text-zinc-900 dark:text-zinc-100" selectable>
          Failed to load posts. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        className="bg-zinc-50 dark:bg-zinc-950"
        key={isWideScreen ? 'grid' : 'list'}
        numColumns={isWideScreen ? 2 : 1}
        columnWrapperStyle={isWideScreen ? { gap: 16 } : undefined}
        renderItem={({ item }) => (
          <View style={isWideScreen ? { flex: 1 } : undefined}>
            <Link href={`/blog/${item.id}`} asChild>
              <BlogPostCard post={item} />
            </Link>
          </View>
        )}
        ListHeaderComponent={ListHeader}
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
            <Text className="text-base text-zinc-500">
              {isSearching ? 'No results found.' : 'No posts found.'}
            </Text>
          </View>
        }
      />
      <Stack.Screen options={{ title: 'Blog', headerRight: androidHeaderRight }} />
      <Stack.SearchBar
        placeholder="Search posts..."
        onChangeText={(e: any) => setSearchQuery(e.nativeEvent.text)}
        onCancelButtonPress={() => setSearchQuery('')}
      />
      {isIOS && (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button
            icon="bookmark"
            onPress={() => router.push('/bookmarks' as any)}
          />
        </Stack.Toolbar>
      )}
    </>
  );
}
