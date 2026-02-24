import { Link } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View, useWindowDimensions } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { CategoryFilter } from '@/components/category-filter';
import { PortfolioCard } from '@/components/portfolio-card';
import { queryKeys } from '@/hooks/query-keys';
import { useHaptics } from '@/hooks/use-haptics';
import { usePortfolioCategories, usePortfolioItems } from '@/hooks/use-portfolio';

export default function PortfolioScreen() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = usePortfolioItems();
  const { data: categories } = usePortfolioCategories();
  const haptics = useHaptics();
  const queryClient = useQueryClient();
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 768;
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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

  const ListHeader = useMemo(() => {
    if (!categories || categories.length === 0) return null;
    return (
      <CategoryFilter
        categories={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />
    );
  }, [categories, selectedCategory]);

  const handleRefresh = useCallback(async () => {
    await refetch();
    haptics.notification();
  }, [refetch, haptics]);

  if (isLoading && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-5 dark:bg-zinc-950">
        <Text className="text-center text-base text-zinc-900 dark:text-zinc-100" selectable>
          Failed to load portfolio. Please try again later.
        </Text>
      </View>
    );
  }

  return (
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
          <Text className="text-base text-zinc-500">No portfolio items found.</Text>
        </View>
      }
    />
  );
}
