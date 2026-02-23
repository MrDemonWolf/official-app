import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { PlatformIcon } from '@/components/platform-icon';
import { useAbout } from '@/hooks/use-about';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHaptics } from '@/hooks/use-haptics';
import type { WPAuthorAcf, WPSocialLink } from '@/types/wordpress';

const FALLBACK_AVATAR =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=800';

function getBestAvatar(avatarUrls: Record<string, string>): string {
  const sizes = Object.keys(avatarUrls)
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => b - a);
  return sizes.length > 0 ? avatarUrls[String(sizes[0])] : FALLBACK_AVATAR;
}

const FALLBACK_BIO = [
  'I take great pride in crafting dynamic Web Applications and alluring WordPress websites. With years of experience under my belt I have honed my skills in Web Engineering, Design and maintenance.',
  'These skills I now offer to those seeking to craft new and innovative opportunities in website and software development, my diverse experience in many exciting projects will ensure that I can bring any idea to life.',
  'In order to maintain a healthy work-life balance I enjoy kicking back and playing games with friends and even some live streaming, when I am not doing that I use my spare time to continue learning or even experimenting with building websites and web applications.',
  'Join me for some fun and engaging content that blends both business and pleasure.',
];

// Brand icon SVGs — tinted at runtime via expo-image tintColor
const SOCIAL_ICON_SOURCES: Record<string, number> = {
  github: require('@/assets/images/social/github.svg'),
  discord: require('@/assets/images/social/discord.svg'),
  x: require('@/assets/images/social/x.svg'),
  twitch: require('@/assets/images/social/twitch.svg'),
  youtube: require('@/assets/images/social/youtube.svg'),
  facebook: require('@/assets/images/social/facebook.svg'),
  instagram: require('@/assets/images/social/instagram.svg'),
  bluesky: require('@/assets/images/social/bluesky.svg'),
  linkedin: require('@/assets/images/social/linkedin.svg'),
  mastodon: require('@/assets/images/social/mastodon.svg'),
  threads: require('@/assets/images/social/threads.svg'),
  tiktok: require('@/assets/images/social/tiktok.svg'),
  reddit: require('@/assets/images/social/reddit.svg'),
  steam: require('@/assets/images/social/steam.svg'),
};

interface SocialLink {
  platform: string;
  url: string;
  label: string;
  iconSource: number | null;
  iconUrl: string | null;
  isWebsite: boolean;
}

function getSocialLinks(acf: WPAuthorAcf | undefined): SocialLink[] {
  if (!acf?.social_links) return [];

  return acf.social_links
    .filter((link: WPSocialLink) => link.url)
    .map((link: WPSocialLink) => {
      const platform = link.platform.toLowerCase();
      const isWebsite = platform === 'website';
      const iconSource = SOCIAL_ICON_SOURCES[platform] ?? null;
      const iconUrl = !isWebsite && !iconSource && link.icon_url ? link.icon_url : null;
      const label = link.label || platform.charAt(0).toUpperCase() + platform.slice(1);

      return { platform, url: link.url, label, iconSource, iconUrl, isWebsite };
    });
}

export default function AboutScreen() {
  const { data: user, isLoading, refetch } = useAbout();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const haptics = useHaptics();
  const [refreshing, setRefreshing] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(0);

  const authorName = user?.name ?? 'MrDemonWolf';
  const authorBio = user?.description;
  const roleTitle = user?.acf?.role_title;
  const baseAvatarUrl = user?.avatar_urls
    ? getBestAvatar(user.avatar_urls)
    : FALLBACK_AVATAR;
  const avatarUrl = cacheBuster > 0
    ? `${baseAvatarUrl}${baseAvatarUrl.includes('?') ? '&' : '?'}_t=${cacheBuster}`
    : baseAvatarUrl;
  const socialLinks = getSocialLinks(user?.acf);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setCacheBuster(Date.now());
    await refetch();
    haptics.notification();
    setRefreshing(false);
  }, [refetch, haptics]);

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
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 40 }}
      className="bg-zinc-50 dark:bg-zinc-950"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header area */}
      <View
        className="bg-zinc-100 dark:bg-zinc-900"
        style={{ paddingTop: 32, paddingBottom: 24, alignItems: 'center' }}
      >
        {/* Circular avatar */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: isDark ? '#3f3f46' : '#e4e4e7',
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            alt={`${authorName} avatar`}
          />
        </View>

        {/* Name */}
        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: isDark ? '#fafafa' : '#18181b',
            marginTop: 16,
            letterSpacing: -0.5,
          }}
        >
          {authorName}
        </Text>

        {/* Role / tagline */}
        {roleTitle ? (
          <Text
            style={{
              fontSize: 15,
              color: isDark ? '#a1a1aa' : '#71717a',
              marginTop: 4,
            }}
          >
            {roleTitle}
          </Text>
        ) : null}

        {/* Social links row */}
        {socialLinks.length > 0 ? (
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {socialLinks.map((link) => (
              <Pressable
                key={link.platform + link.url}
                onPress={() => handleSocialPress(link.url)}
                accessibilityRole="link"
                accessibilityLabel={`${link.label} profile`}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isDark
                    ? pressed ? '#3f3f46' : '#27272a'
                    : pressed ? '#d4d4d8' : '#e4e4e7',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                {link.isWebsite ? (
                  <PlatformIcon name="globe" size={22} tintColor={isDark ? '#fafafa' : '#18181b'} />
                ) : link.iconSource ? (
                  <Image
                    source={link.iconSource}
                    style={{ width: 22, height: 22 }}
                    tintColor={isDark ? '#fafafa' : '#18181b'}
                  />
                ) : link.iconUrl ? (
                  <Image
                    source={{ uri: link.iconUrl }}
                    style={{ width: 22, height: 22 }}
                    tintColor={isDark ? '#fafafa' : '#18181b'}
                  />
                ) : (
                  <PlatformIcon name="globe" size={22} tintColor={isDark ? '#fafafa' : '#18181b'} />
                )}
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      {/* Bio card */}
      <View style={{ padding: 16, gap: 16 }}>
        {authorBio ? (
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
    </ScrollView>
  );
}
