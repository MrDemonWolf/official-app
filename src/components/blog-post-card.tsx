import { Image } from 'expo-image';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useHaptics } from '@/hooks/use-haptics';
import { decodeHtmlEntities } from '@/lib/decode-html';
import { cn } from '@/lib/utils';
import { getFeaturedImage, stripHtml } from '@/lib/wordpress-helpers';
import type { WPPost } from '@/types/wordpress';

interface BlogPostCardProps {
  post: WPPost;
  onPress?: () => void;
  ref?: React.Ref<View>;
}

export function BlogPostCard({ post, onPress, ref }: BlogPostCardProps) {
  const title = decodeHtmlEntities(post.title.rendered);
  const excerpt = decodeHtmlEntities(stripHtml(post.excerpt.rendered)).slice(0, 150);
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const featuredImage = getFeaturedImage(post);
  const authorName = post._embedded?.author?.[0]?.name;
  const categories = post._embedded?.['wp:term']?.[0]
    ?.map((term) => term.name)
    .join(', ');

  const metaParts = [authorName && `by ${authorName}`, date, categories].filter(Boolean);
  const haptics = useHaptics();

  const handlePress = useCallback(() => {
    haptics.impact(ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress, haptics]);

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={title}
      className={cn(
        'overflow-hidden rounded-xl bg-white dark:bg-zinc-900',
        'active:opacity-80'
      )}
      style={{
        borderCurve: 'continuous',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {featuredImage && (
        <Image
          source={{ uri: featuredImage.url }}
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          contentFit="cover"
          alt={featuredImage.alt}
        />
      )}
      <View className="gap-2 p-4">
        <Text
          className="text-xl font-bold text-zinc-900 dark:text-zinc-100"
          numberOfLines={2}
        >
          {title}
        </Text>
        {metaParts.length > 0 && (
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            {metaParts.join(' | ')}
          </Text>
        )}
        {excerpt && (
          <Text
            className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300"
            numberOfLines={3}
          >
            {excerpt}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
