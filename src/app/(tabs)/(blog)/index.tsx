import { Link, router, Stack } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { BlogPostCard } from '@/components/blog-post-card';
import { useCategories } from '@/hooks/use-categories';
import { queryKeys } from '@/hooks/query-keys';
import { useHaptics } from '@/hooks/use-haptics';
import { usePosts } from '@/hooks/use-posts';
import { useSearchPosts } from '@/hooks/use-search-posts';
import { useSettings } from '@/contexts/settings-context';

export default function BlogScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 768;

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
  const { settings, setFontSize, setNotificationsEnabled } = useSettings();

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

  const activeCategoryName = useMemo(
    () => categories?.find((c) => c.id === selectedCategory)?.name,
    [categories, selectedCategory],
  );

  const ListHeader = activeCategoryName ? (
    <Pressable
      onPress={() => {
        setSelectedCategory(null);
        haptics.selection();
      }}
      className="self-start flex-row items-center rounded-full bg-blue-100 px-3 py-1.5 dark:bg-blue-900"
    >
      <Text className="text-sm font-medium text-blue-800 dark:text-blue-200">
        {activeCategoryName}
      </Text>
      <Text className="ml-1.5 text-sm text-blue-600 dark:text-blue-400">
        ✕
      </Text>
    </Pressable>
  ) : null;

  if (isLoading && posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Blog' }} />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-5 dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Blog' }} />
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
          <View style={isWideScreen ? { width: (width - 48) / 2 } : undefined}>
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
      <Stack.Screen options={{ title: 'Blog' }} />
      {/* iOS native search bar integrated into the navigation header */}
      <Stack.SearchBar
        placeholder="Search posts..."
        onChangeText={(e: any) => setSearchQuery(e.nativeEvent.text)}
        onCancelButtonPress={() => setSearchQuery('')}
      />
      {/* iOS native toolbar: visible filter menu + ellipsis for secondary actions */}
      <Stack.Toolbar placement="right">
        {categories && categories.length > 0 && !isSearching && (
          <Stack.Toolbar.Menu icon="line.3.horizontal.decrease.circle" title="Filter">
            <Stack.Toolbar.MenuAction
              isOn={selectedCategory === null}
              onPress={() => setSelectedCategory(null)}
            >
              All
            </Stack.Toolbar.MenuAction>
            {categories.filter(c => c.count > 0).map((cat) => (
              <Stack.Toolbar.MenuAction
                key={cat.id}
                isOn={selectedCategory === cat.id}
                onPress={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
        )}
        <Stack.Toolbar.Menu icon="ellipsis">
          <Stack.Toolbar.MenuAction
            icon="bookmark"
            onPress={() => router.push('/bookmarks' as any)}
          >
            Bookmarks
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.Menu icon="textformat.size" title="Font Size">
            <Stack.Toolbar.MenuAction
              icon="textformat.size.smaller"
              isOn={settings.fontSize === 'small'}
              onPress={() => setFontSize('small')}
            >
              Small
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction
              icon="textformat.size"
              isOn={settings.fontSize === 'medium'}
              onPress={() => setFontSize('medium')}
            >
              Medium
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction
              icon="textformat.size.larger"
              isOn={settings.fontSize === 'large'}
              onPress={() => setFontSize('large')}
            >
              Large
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
          <Stack.Toolbar.MenuAction
            icon={settings.notificationsEnabled ? 'bell.slash' : 'bell'}
            onPress={() => setNotificationsEnabled(!settings.notificationsEnabled)}
          >
            {settings.notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction
            icon="arrow.clockwise"
            destructive
            onPress={() => {
              Alert.alert(
                'Clear Cache',
                'This will clear all cached data. Are you sure?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => queryClient.clear(),
                  },
                ],
              );
            }}
          >
            Clear Cache
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
    </>
  );
}
