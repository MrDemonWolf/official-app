import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { HtmlContent } from '@/components/html-content';
import { usePost } from '@/hooks/use-post';
import { decodeHtmlEntities } from '@/lib/decode-html';
import { getFeaturedImage } from '@/lib/wordpress-helpers';

export default function BlogPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isLoading, error } = usePost(id);
  const { width } = useWindowDimensions();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-5 dark:bg-zinc-950">
        <Stack.Screen options={{ title: 'Error' }} />
        <Text className="text-center text-base text-zinc-900 dark:text-zinc-100" selectable>
          Failed to load post. Please try again later.
        </Text>
      </View>
    );
  }

  const title = decodeHtmlEntities(post.title.rendered);
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const featuredImage = getFeaturedImage(post);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      <Stack.Screen options={{ title }} />
      {featuredImage && (
        <Image
          source={{ uri: featuredImage.url }}
          style={{
            width,
            aspectRatio:
              featuredImage.width && featuredImage.height
                ? featuredImage.width / featuredImage.height
                : 16 / 9,
          }}
          contentFit="cover"
          alt={featuredImage.alt}
        />
      )}
      <View style={{ padding: 16, gap: 16 }}>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">{date}</Text>
        <HtmlContent html={post.content.rendered} />
      </View>
    </ScrollView>
  );
}
