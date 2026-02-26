import { Image } from 'expo-image';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { Linking, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { HtmlContent } from '@/components/html-content';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHaptics } from '@/hooks/use-haptics';

interface FeaturedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface PortfolioDetailBodyProps {
  contentHtml: string;
  featuredImage: FeaturedImage | null;
  projectUrl?: string;
  technologies?: string;
  client?: string;
}

export function PortfolioDetailBody({
  contentHtml,
  featuredImage,
  projectUrl,
  technologies,
  client,
}: PortfolioDetailBodyProps) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const haptics = useHaptics();

  return (
    <>
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
                      backgroundColor: isDark ? '#3b82f640' : '#3b82f620',
                    }}
                  >
                    <Text style={{ fontSize: 12, color: isDark ? '#60a5fa' : '#3b82f6', fontWeight: '500' }}>
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
            onPress={() => {
              haptics.impact(ImpactFeedbackStyle.Light);
              Linking.openURL(projectUrl);
            }}
            accessibilityRole="link"
            accessibilityLabel="View Project"
            accessibilityHint="Opens the project in your browser"
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
    </>
  );
}
