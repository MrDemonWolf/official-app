import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { PlatformIcon } from '@/components/platform-icon';
import { PortfolioDetailBody } from '@/components/portfolio-detail-body';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePortfolioItem } from '@/hooks/use-portfolio';
import { useShare } from '@/hooks/use-share';
import { decodeHtmlEntities } from '@/lib/decode-html';
import { getFeaturedImage } from '@/lib/wordpress-helpers';

export default function PortfolioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: item, isLoading } = usePortfolioItem(id);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { shareContent } = useShare();

  const resolved = useMemo(() => {
    if (!item) return null;
    return {
      title: decodeHtmlEntities(item.title.rendered),
      contentHtml: item.content.rendered,
      featuredImage: getFeaturedImage(item),
      postLink: item.link,
      projectUrl: item.acf?.project_url,
      technologies: item.acf?.technologies,
      client: item.acf?.client,
    };
  }, [item]);

  const handleShare = useCallback(() => {
    if (resolved) {
      shareContent(resolved.title, resolved.postLink);
    }
  }, [shareContent, resolved]);

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
          Failed to load portfolio item. Please try again later.
        </Text>
      </View>
    );
  }

  // Android header with PlatformIcon buttons (maps to MaterialIcons)
  const headerRight = () => (
    <Pressable
      onPress={handleShare}
      accessibilityRole="button"
      accessibilityLabel="Share"
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
    >
      <PlatformIcon name="square.and.arrow.up" size={24} tintColor={isDark ? '#f4f4f5' : '#18181b'} />
    </Pressable>
  );

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="bg-zinc-50 dark:bg-zinc-950"
      >
        <PortfolioDetailBody
          contentHtml={resolved.contentHtml}
          featuredImage={resolved.featuredImage}
          projectUrl={resolved.projectUrl}
          technologies={resolved.technologies}
          client={resolved.client}
        />
      </ScrollView>
      <Stack.Screen options={{ title: resolved.title, headerRight }} />
    </>
  );
}
