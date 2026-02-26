import { Link, Stack } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, Text, View, useWindowDimensions } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { PortfolioCard } from '@/components/portfolio-card';
import { queryKeys } from '@/hooks/query-keys';
import { useHaptics } from '@/hooks/use-haptics';
import { usePortfolioCategories, usePortfolioItems, useSearchPortfolio } from '@/hooks/use-portfolio';
import { useSettings } from '@/contexts/settings-context';

export default function PortfolioScreen() {
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

  const portfolioQuery = usePortfolioItems();
  const searchResults = useSearchPortfolio(debouncedQuery);
  const { data: categories } = usePortfolioCategories();

  const activeQuery = isSearching ? searchResults : portfolioQuery;
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

  const allItems = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data?.pages]);

  // Filter by project_category if a category chip is selected
  const items = useMemo(() => {
    if (!selectedCategory) return allItems;
    return allItems.filter((item) => item.project_category?.includes(selectedCategory));
  }, [allItems, selectedCategory]);

  useEffect(() => {
    for (const item of allItems) {
      queryClient.setQueryData(queryKeys.portfolioItem(item.id.toString()), item);
    }
  }, [allItems, queryClient]);

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

  if (isLoading && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Portfolio' }} />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-5 dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Portfolio' }} />
        <Text className="text-center text-base text-zinc-900 dark:text-zinc-100" selectable>
          Failed to load portfolio. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        className="bg-zinc-50 dark:bg-zinc-950"
        key={isWideScreen ? 'grid' : 'list'}
        numColumns={isWideScreen ? 2 : 1}
        columnWrapperStyle={isWideScreen ? { gap: 16 } : undefined}
        renderItem={({ item }) => (
          <View style={isWideScreen ? { width: (width - 48) / 2 } : undefined}>
            <Link href={`/portfolio/${item.id}` as any} asChild>
              <PortfolioCard item={item} />
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
              {isSearching ? 'No results found.' : 'No portfolio items found.'}
            </Text>
          </View>
        }
      />
      <Stack.Screen options={{ title: 'Portfolio' }} />
      <Stack.SearchBar
        placeholder="Search portfolio..."
        onChangeText={(e: any) => setSearchQuery(e.nativeEvent.text)}
        onCancelButtonPress={() => setSearchQuery('')}
      />
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
