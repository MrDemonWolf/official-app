import { Image } from 'expo-image';
import { ActivityIndicator, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { HtmlContent } from '@/components/html-content';
import { useAbout } from '@/hooks/use-about';
import { useColorScheme } from '@/hooks/use-color-scheme';

const HEADER_HEIGHT = 300;

const FALLBACK_AVATAR =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=800';

function getHighResAvatar(url: string): string {
  return url.replace(/([?&])s=\d+/, '$1s=800');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function hasUsableContent(html: string | undefined): boolean {
  if (!html) return false;
  if (html.includes('et_pb_')) return false;
  const text = stripHtml(html);
  return text.length > 20;
}

const FALLBACK_BIO = [
  'I take great pride in crafting dynamic Web Applications and alluring WordPress websites. With years of experience under my belt I have honed my skills in Web Engineering, Design and maintenance.',
  'These skills I now offer to those seeking to craft new and innovative opportunities in website and software development, my diverse experience in many exciting projects will ensure that I can bring any idea to life.',
  'In order to maintain a healthy work-life balance I enjoy kicking back and playing games with friends and even some live streaming, when I am not doing that I use my spare time to continue learning or even experimenting with building websites and web applications.',
  'Join me for some fun and engaging content that blends both business and pleasure.',
];

export default function AboutScreen() {
  const { data: page, isLoading } = useAbout();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const author = page?._embedded?.author?.[0];
  const authorName = author?.name ?? 'MrDemonWolf';
  const authorBio = author?.description;
  const avatarUrl = author?.avatar_urls?.['96']
    ? getHighResAvatar(author.avatar_urls['96'])
    : FALLBACK_AVATAR;
  const wpContentUsable = hasUsableContent(page?.content?.rendered);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0],
      [2, 1],
      { extrapolateRight: Extrapolation.CLAMP }
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT * 0.5],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.4],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 40 }}
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      {/* Parallax Hero */}
      <Animated.View
        style={[{ height: HEADER_HEIGHT, width, overflow: 'hidden' }, headerStyle]}
      >
        <Image
          source={{ uri: avatarUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />

        {/* Dark overlay for readability */}
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
          }}
        />

        {/* Bottom gradient + name */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: 20,
              paddingBottom: 16,
              paddingTop: 60,
              experimental_backgroundImage:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            },
            overlayStyle,
          ]}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: -0.5,
            }}
          >
            {authorName}
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Content */}
      <View style={{ padding: 16, gap: 16 }}>
        {wpContentUsable ? (
          <View
            className="rounded-2xl bg-white dark:bg-zinc-900"
            style={{
              padding: 16,
              borderCurve: 'continuous',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <HtmlContent html={page!.content.rendered} />
          </View>
        ) : authorBio ? (
          <View
            className="rounded-2xl bg-white dark:bg-zinc-900"
            style={{
              padding: 16,
              borderCurve: 'continuous',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                lineHeight: 26,
                color: isDark ? '#d4d4d8' : '#3f3f46',
              }}
              selectable
            >
              {authorBio}
            </Text>
          </View>
        ) : (
          <View
            className="rounded-2xl bg-white dark:bg-zinc-900"
            style={{
              padding: 16,
              gap: 12,
              borderCurve: 'continuous',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            {FALLBACK_BIO.map((paragraph, i) => (
              <Text
                key={i}
                style={{
                  fontSize: 16,
                  lineHeight: 26,
                  color: isDark ? '#d4d4d8' : '#3f3f46',
                }}
                selectable
              >
                {paragraph}
              </Text>
            ))}
          </View>
        )}
      </View>
    </Animated.ScrollView>
  );
}
