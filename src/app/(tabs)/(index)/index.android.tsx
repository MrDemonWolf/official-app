import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

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

export default function AboutScreen() {
  const { data: user, isLoading } = useAbout();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const haptics = useHaptics();

  const authorName = user?.name ? decodeHtmlEntities(user.name) : 'MrDemonWolf';
  const authorBio = user?.description ? decodeHtmlEntities(user.description) : undefined;
  const roleTitle = user?.acf?.role_title ? decodeHtmlEntities(user.acf.role_title) : undefined;
  const avatarUrl = user?.avatar_urls
    ? getBestAvatar(user.avatar_urls)
    : FALLBACK_AVATAR;
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
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 40 }}
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      {/* Header area */}
      <View style={{ padding: 16, paddingTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {/* Circular avatar */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
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

          {/* Name + role */}
          <View style={{ flex: 1 }}>
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
      <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
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
    </ScrollView>
  );
}
