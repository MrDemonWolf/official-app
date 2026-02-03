import { forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/utils';
import type { WPPost } from '@/types/wordpress';

interface BlogPostCardProps {
  post: WPPost;
  onPress?: () => void;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—');
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

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      className={cn(
        'rounded-xl bg-white p-4 dark:bg-zinc-900',
        'active:opacity-80'
      )}
      style={{
        borderCurve: 'continuous',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <View className="gap-2">
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
