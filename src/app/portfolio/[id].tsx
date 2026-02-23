import { Image } from 'expo-image';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { HtmlContent } from '@/components/html-content';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHaptics } from '@/hooks/use-haptics';
import { usePortfolioItem } from '@/hooks/use-portfolio';
import { useShare } from '@/hooks/use-share';
import { decodeHtmlEntities } from '@/lib/decode-html';
import { getFeaturedImage } from '@/lib/wordpress-helpers';

export default function PortfolioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: item, isLoading } = usePortfolioItem(id);
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { shareContent } = useShare();
  const haptics = useHaptics();

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

  const {
    title, contentHtml, featuredImage,
    projectUrl, technologies, client,
  } = resolved;

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="bg-zinc-50 dark:bg-zinc-950"
      >
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
        <View style={{ padding: 16, gap: 16, maxWidth: 680, alignSelf: 'center', width: '100%' }}>
          {/* Meta info */}
          {(technologies || client) && (
            <View style={{ gap: 8 }}>
              {client && (
                <Text style={{ fontSize: 14, color: isDark ? '#a1a1aa' : '#71717a' }}>
                  Client: {client}
                </Text>
              )}
              {technologies && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {technologies.split(',').map((tech: string) => (
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
            </View>
          )}

          {/* Project URL */}
          {projectUrl && (
            <View
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 10,
                backgroundColor: '#3b82f6',
                alignItems: 'center',
              }}
              onTouchEnd={() => {
                haptics.impact(ImpactFeedbackStyle.Light);
                Linking.openURL(projectUrl);
              }}
              accessibilityRole="link"
              accessibilityLabel="View Project"
              accessibilityHint="Opens the project in your browser"
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#ffffff' }}>
                View Project
              </Text>
            </View>
          )}

          <HtmlContent html={contentHtml} />
        </View>
      </ScrollView>
      <Stack.Screen options={{ title }} />
      {/* iOS native toolbar buttons using SF Symbols */}
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="square.and.arrow.up" onPress={handleShare} />
      </Stack.Toolbar>
    </>
  );
}
