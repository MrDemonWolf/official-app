import { Image } from 'expo-image';
import { forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { decodeHtmlEntities } from '@/lib/decode-html';
import { cn } from '@/lib/utils';
import { getFeaturedImage } from '@/lib/wordpress-helpers';
import type { WPPost } from '@/types/wordpress';

interface BlogPostCardProps {
  post: WPPost;
  onPress?: () => void;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export const BlogPostCard = forwardRef<View, BlogPostCardProps>(({ post, onPress }, ref) => {
  const title = decodeHtmlEntities(post.title.rendered);
  const excerpt = decodeHtmlEntities(stripHtml(post.excerpt.rendered)).slice(0, 150);
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const featuredImage = getFeaturedImage(post);

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
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
      <View className={cn('gap-2 p-4', featuredImage && 'pt-3')}>
        <Text
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">{date}</Text>
        {excerpt && (
          <Text
            className="text-base text-zinc-600 dark:text-zinc-300"
            numberOfLines={3}
          >
            {excerpt}...
          </Text>
        )}
      </View>
    </Pressable>
  );
});

BlogPostCard.displayName = 'BlogPostCard';
