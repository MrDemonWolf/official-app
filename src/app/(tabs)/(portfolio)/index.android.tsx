import { Link, Stack } from 'expo-router';
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

import { CategoryFilter } from '@/components/category-filter';
import { PlatformIcon } from '@/components/platform-icon';
import { PortfolioCard } from '@/components/portfolio-card';
import { QuickActionsSheet } from '@/components/quick-actions-sheet';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryKeys } from '@/hooks/query-keys';
import { useHaptics } from '@/hooks/use-haptics';
import { usePortfolioCategories, usePortfolioItems, useSearchPortfolio } from '@/hooks/use-portfolio';

export default function PortfolioScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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

  // Android header: overflow menu
  const headerRight = () => (
    <Pressable
      onPress={() => setSheetVisible(true)}
      accessibilityRole="button"
      accessibilityLabel="More options"
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
    >
      <PlatformIcon
        name="ellipsis"
        size={24}
        tintColor={isDark ? '#f4f4f5' : '#18181b'}
      />
    </Pressable>
  );

  const ListHeader = useMemo(() => {
    return (
      <View style={{ gap: 12 }}>
        {/* Android TextInput search bar */}
        <TextInput
          placeholder="Search portfolio..."
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

  if (isLoading && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Portfolio', headerRight }} />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-5 dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Portfolio', headerRight }} />
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
      <Stack.Screen options={{ title: 'Portfolio', headerRight }} />
      <QuickActionsSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      />
    </>
  );
}
