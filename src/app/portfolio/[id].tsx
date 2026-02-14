import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { BookmarkButton } from '@/components/bookmark-button';
import { HtmlContent } from '@/components/html-content';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePortfolioItem } from '@/hooks/use-portfolio';
import { useShare } from '@/hooks/use-share';
import { decodeHtmlEntities } from '@/lib/decode-html';
import { getBookmarkedContent } from '@/services/bookmarks';
import type { BookmarkedPost } from '@/types/bookmark';

function getFeaturedImage(item: { _embedded?: any }) {
  const media = item._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  const sizes = media.media_details?.sizes;
  const preferred = sizes?.medium_large ?? sizes?.medium;
  if (preferred) {
    return {
      url: preferred.source_url,
      alt: media.alt_text || '',
      width: preferred.width,
      height: preferred.height,
    };
  }
  if (media.source_url) {
    return {
      url: media.source_url,
      alt: media.alt_text || '',
      width: media.media_details?.width ?? 0,
      height: media.media_details?.height ?? 0,
    };
  }
  return null;
}

export default function PortfolioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: item, isLoading, error } = usePortfolioItem(id);
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { shareContent } = useShare();

  // Offline fallback
  const [offlinePost, setOfflinePost] = useState<BookmarkedPost | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (error && id) {
      getBookmarkedContent(parseInt(id, 10)).then((cached) => {
        if (cached) {
          setOfflinePost(cached);
          setIsOffline(true);
        }
      });
    }
  }, [error, id]);

  // Normalize data
  const resolved = useMemo(() => {
    if (item) {
      return {
        title: decodeHtmlEntities(item.title.rendered),
        dateStr: item.date,
        contentHtml: item.content.rendered,
        featuredImage: getFeaturedImage(item),
        offlineFeaturedUrl: null as string | null,
        postLink: item.link,
        authorName: item._embedded?.author?.[0]?.name || null,
        excerpt: decodeHtmlEntities(item.excerpt.rendered.replace(/<[^>]*>/g, '')).slice(0, 150),
        postId: item.id,
        projectUrl: item.acf?.project_url,
        technologies: item.acf?.technologies,
        client: item.acf?.client,
      };
    }
    if (offlinePost) {
      return {
        title: offlinePost.title,
        dateStr: offlinePost.date,
        contentHtml: offlinePost.content_html,
        featuredImage: null,
        offlineFeaturedUrl: offlinePost.featured_image_url,
        postLink: offlinePost.link,
        authorName: offlinePost.author_name,
        excerpt: offlinePost.excerpt,
        postId: offlinePost.post_id,
        projectUrl: undefined as string | undefined,
        technologies: undefined as string | undefined,
        client: undefined as string | undefined,
      };
    }
    return null;
  }, [item, offlinePost]);

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
    title, dateStr, contentHtml, featuredImage, offlineFeaturedUrl,
    postLink, authorName, excerpt, postId, projectUrl, technologies, client,
  } = resolved;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      <Stack.Screen
        options={{
          title,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <Pressable
                onPress={handleShare}
                hitSlop={4}
                style={({ pressed }) => ({
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 18,
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <SymbolView
                  name="square.and.arrow.up"
                  size={20}
                  tintColor="#3b82f6"
                  resizeMode="scaleAspectFit"
                />
              </Pressable>
              <BookmarkButton
                postId={postId}
                postType="portfolio"
                title={title}
                excerpt={excerpt}
                featuredImageUrl={featuredImage?.url || offlineFeaturedUrl || null}
                contentHtml={contentHtml}
                authorName={authorName}
                date={dateStr}
                link={postLink}
              />
            </View>
          ),
        }}
      />

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
          </View>
        )}

        {/* Project URL */}
        {projectUrl && (
          <Pressable
            onPress={() => Linking.openURL(projectUrl)}
            style={({ pressed }) => ({
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 10,
              backgroundColor: '#3b82f6',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#ffffff' }}>
              View Project
            </Text>
          </Pressable>
        )}

        <HtmlContent html={contentHtml} />
      </View>
    </ScrollView>
  );
}
