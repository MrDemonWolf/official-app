import type { WPAuthorAcf, WPSocialLink } from '@/types/wordpress';

export const FALLBACK_AVATAR =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=800';

export const FALLBACK_BIO = [
  'I take great pride in crafting dynamic Web Applications and alluring WordPress websites. With years of experience under my belt I have honed my skills in Web Engineering, Design and maintenance.',
  'These skills I now offer to those seeking to craft new and innovative opportunities in website and software development, my diverse experience in many exciting projects will ensure that I can bring any idea to life.',
  'In order to maintain a healthy work-life balance I enjoy kicking back and playing games with friends and even some live streaming, when I am not doing that I use my spare time to continue learning or even experimenting with building websites and web applications.',
  'Join me for some fun and engaging content that blends both business and pleasure.',
];

// Brand icon SVGs — tinted at runtime via expo-image tintColor
export const SOCIAL_ICON_SOURCES: Record<string, number> = {
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

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
  iconSource: number | null;
  iconUrl: string | null;
  isWebsite: boolean;
}

export function getBestAvatar(avatarUrls: Record<string, string>): string {
  const sizes = Object.keys(avatarUrls)
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => b - a);
  return sizes.length > 0 ? avatarUrls[String(sizes[0])] : FALLBACK_AVATAR;
}

export function getSocialLinks(acf: WPAuthorAcf | undefined): SocialLink[] {
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
