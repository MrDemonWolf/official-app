import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { HtmlContent } from '@/components/html-content';
import { usePost } from '@/hooks/use-post';

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

export default function BlogPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isLoading, error } = usePost(id);

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

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 16 }}
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      <Stack.Screen options={{ title }} />
      <Text className="text-sm text-zinc-500 dark:text-zinc-400">{date}</Text>
      <HtmlContent html={post.content.rendered} />
    </ScrollView>
  );
}
