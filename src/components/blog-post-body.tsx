import { Image } from 'expo-image';
import { Text, View, useWindowDimensions } from 'react-native';

import { HtmlContent } from '@/components/html-content';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface FeaturedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface BlogPostBodyProps {
  contentHtml: string;
  dateStr: string;
  featuredImage: FeaturedImage | null;
  offlineFeaturedUrl: string | null;
  isOffline: boolean;
}

export function BlogPostBody({
  contentHtml,
  dateStr,
  featuredImage,
  offlineFeaturedUrl,
  isOffline,
}: BlogPostBodyProps) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const date = new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Offline banner */}
      {isOffline && (
        <View
          style={{
            padding: 10,
            backgroundColor: isDark ? '#422006' : '#fef3c7',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 13, color: isDark ? '#fbbf24' : '#92400e' }}>
            Viewing saved copy — you appear to be offline
          </Text>
        </View>
      )}

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
      {!featuredImage && offlineFeaturedUrl && (
        <Image
          source={{ uri: offlineFeaturedUrl }}
          style={{ width, aspectRatio: 16 / 9 }}
          contentFit="cover"
        />
      )}
      <View style={{ padding: 16, gap: 16, maxWidth: 680, alignSelf: 'center', width: '100%' }}>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">{date}</Text>
        <HtmlContent html={contentHtml} />
      </View>
    </>
  );
}
