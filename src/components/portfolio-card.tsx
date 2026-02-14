import { Image } from 'expo-image';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { forwardRef, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useHaptics } from '@/hooks/use-haptics';
import { decodeHtmlEntities } from '@/lib/decode-html';
import { cn } from '@/lib/utils';
import type { WPPortfolioItem } from '@/types/portfolio';

interface PortfolioCardProps {
  item: WPPortfolioItem;
  onPress?: () => void;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function getFeaturedImage(item: WPPortfolioItem) {
  const media = item._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;

  const sizes = media.media_details?.sizes;
  const preferred = sizes?.medium_large ?? sizes?.medium;

  if (preferred) {
    return { url: preferred.source_url, alt: media.alt_text || '' };
  }

  if (media.source_url) {
    return { url: media.source_url, alt: media.alt_text || '' };
  }

  return null;
}

export const PortfolioCard = forwardRef<View, PortfolioCardProps>(({ item, onPress }, ref) => {
  const title = decodeHtmlEntities(item.title.rendered);
  const excerpt = decodeHtmlEntities(stripHtml(item.excerpt.rendered)).slice(0, 150);
  const featuredImage = getFeaturedImage(item);
  const technologies = item.acf?.technologies;
  const haptics = useHaptics();

  const handlePress = useCallback(() => {
    haptics.impact(ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress, haptics]);

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
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
        {technologies && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {technologies.split(',').map((tech) => (
              <View
                key={tech.trim()}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: '#3b82f620',
                }}
              >
                <Text style={{ fontSize: 12, color: '#3b82f6', fontWeight: '500' }}>
                  {tech.trim()}
                </Text>
              </View>
            ))}
          </View>
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
});

PortfolioCard.displayName = 'PortfolioCard';
