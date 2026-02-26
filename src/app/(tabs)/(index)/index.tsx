import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { ActivityIndicator, Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { PlatformIcon } from '@/components/platform-icon';
import { useAbout } from '@/hooks/use-about';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHaptics } from '@/hooks/use-haptics';
import {
  FALLBACK_AVATAR,
  FALLBACK_BIO,
  getBestAvatar,
  getSocialLinks,
} from '@/lib/about-helpers';
import { decodeHtmlEntities } from '@/lib/decode-html';

const BANNER_HEIGHT = 220;
const AVATAR_SIZE = 90;

function getBannerUrl(avatarUrl: string): string {
  return avatarUrl.replace(/[?&]s=\d+/, (match) => match.replace(/\d+/, '800'));
}

export default function AboutScreen() {
  const { data: user, isLoading } = useAbout();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const haptics = useHaptics();
  const { width: screenWidth } = useWindowDimensions();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const bannerImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-200, 0, BANNER_HEIGHT],
      [1.8, 1.2, 1],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, BANNER_HEIGHT],
      [0, BANNER_HEIGHT * 0.5],
      Extrapolation.CLAMP,
    );
    // On overscroll (pull down), keep banner pinned to top
    const top = interpolate(
      scrollY.value,
      [-200, 0],
      [-200, 0],
      { extrapolateRight: Extrapolation.CLAMP, extrapolateLeft: Extrapolation.EXTEND },
    );
    return {
      transform: [{ translateY }, { scale }],
      top,
    };
  });

  const authorName = user?.name ? decodeHtmlEntities(user.name) : 'MrDemonWolf';
  const authorBio = user?.description ? decodeHtmlEntities(user.description) : undefined;
  const roleTitle = user?.acf?.role_title ? decodeHtmlEntities(user.acf.role_title) : undefined;
  const avatarUrl = user?.avatar_urls
    ? getBestAvatar(user.avatar_urls)
    : FALLBACK_AVATAR;
  const bannerUrl = getBannerUrl(avatarUrl);
  const socialLinks = getSocialLinks(user?.acf);

  const handleSocialPress = async (url: string) => {
    haptics.impact();
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {}
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1"
      >
        {/* Banner area */}
        <View style={{ height: BANNER_HEIGHT, overflow: 'hidden' }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                height: BANNER_HEIGHT,
              },
              bannerImageStyle,
            ]}
          >
            <Image
              source={{ uri: bannerUrl }}
              style={{ width: screenWidth, height: BANNER_HEIGHT }}
              contentFit="cover"
              blurRadius={20}
            />
          </Animated.View>
          {/* Dark gradient overlay */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: BANNER_HEIGHT,
              backgroundColor: 'rgba(0,0,0,0.45)',
            }}
          />
        </View>

        {/* Content below banner */}
        <View style={{ paddingHorizontal: 16 }}>
          {/* Avatar overlapping banner */}
          <View
            style={{
              marginTop: -(AVATAR_SIZE / 2),
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
              borderWidth: 3,
              borderColor: isDark ? '#09090b' : '#fafafa',
              overflow: 'hidden',
              backgroundColor: isDark ? '#09090b' : '#fafafa',
            }}
          >
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              alt={`${authorName} avatar`}
            />
          </View>

          {/* Name + role */}
          <View style={{ marginTop: 12 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '800',
                color: isDark ? '#fafafa' : '#18181b',
                letterSpacing: -0.5,
              }}
            >
              {authorName}
            </Text>
            {roleTitle ? (
              <Text
                style={{
                  fontSize: 15,
                  color: isDark ? '#a1a1aa' : '#71717a',
                  marginTop: 2,
                }}
              >
                {roleTitle}
              </Text>
            ) : null}
          </View>

          {/* Social links row */}
          {socialLinks.length > 0 ? (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              {socialLinks.map((link) => (
                <Pressable
                  key={link.platform + link.url}
                  onPress={() => handleSocialPress(link.url)}
                  accessibilityRole="link"
                  accessibilityLabel={`${link.label} profile`}
                  style={({ pressed }) => ({
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isDark
                      ? pressed ? '#3f3f46' : '#27272a'
                      : pressed ? '#d4d4d8' : '#e4e4e7',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  {link.isWebsite ? (
                    <PlatformIcon name="globe" size={20} tintColor={isDark ? '#fafafa' : '#18181b'} />
                  ) : link.iconSource ? (
                    <Image
                      source={link.iconSource}
                      style={{ width: 20, height: 20 }}
                      tintColor={isDark ? '#fafafa' : '#18181b'}
                    />
                  ) : link.iconUrl ? (
                    <Image
                      source={{ uri: link.iconUrl }}
                      style={{ width: 20, height: 20 }}
                      tintColor={isDark ? '#fafafa' : '#18181b'}
                    />
                  ) : (
                    <PlatformIcon name="globe" size={20} tintColor={isDark ? '#fafafa' : '#18181b'} />
                  )}
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {/* Bio */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 12 }}>
          {authorBio ? (
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
          ) : (
            FALLBACK_BIO.map((paragraph, i) => (
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
            ))
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
