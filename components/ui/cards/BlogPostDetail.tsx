import { useEffect, useRef } from 'react';
import {
  Animated,
  PanResponder,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  useColorScheme,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { BlogPostDetailProps } from '../../types';

export function BlogPostDetail({ post, onBack }: BlogPostDetailProps) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const altText = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || 'Featured image';
  const slideAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && gestureState.dx > 50;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          slideAnim.setValue(Math.max(0, 1 - gestureState.dx / 300));
          fadeAnim.setValue(Math.max(0.3, 1 - gestureState.dx / 500));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          handleBack();
        } else {
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Animate in when component mounts
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleBack = () => {
    // Animate out before going back
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onBack();
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 600],
            }),
          },
        ],
      }}
      className="bg-white dark:bg-gray-900">
      {/* Back Button - Fixed Header */}
      <View className="bg-white px-6 pt-12 pb-4 dark:bg-gray-800">
        <TouchableOpacity onPress={handleBack} className="flex-row items-center">
          <Text className="text-2xl">←</Text>
          <Text className="ml-2 font-semibold text-blue-600 dark:text-blue-400">Back</Text>
        </TouchableOpacity>
      </View>{' '}
      <ScrollView className="flex-1">
        {/* Featured Image */}
        {featuredImage && (
          <Image
            source={{ uri: featuredImage }}
            className="h-64 w-full bg-gray-300"
            accessibilityLabel={altText}
          />
        )}

        {/* Article Content */}
        <View className="px-6 py-6">
          {/* Title */}
          <Text className="text-3xl leading-9 font-bold text-gray-900 dark:text-white">
            {post.title.rendered}
          </Text>

          {/* Meta Information */}
          <View className="mt-4 flex-row items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">📅</Text>
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {formatDate(post.date)}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">✍️</Text>
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {post._embedded?.['wp:author']?.[0]?.name || 'Author'}
              </Text>
            </View>
          </View>

          {/* Article Body */}
          <View className="mt-6 mb-6">
            <RenderHTML
              contentWidth={width - 48}
              source={{ html: post.content?.rendered || post.excerpt.rendered }}
              defaultTextProps={{ selectable: true }}
              tagsStyles={{
                body: {
                  color: isDark ? '#e5e7eb' : '#1f2937',
                  fontSize: 16,
                },
                p: {
                  marginVertical: 12,
                  lineHeight: 24,
                  color: isDark ? '#d1d5db' : '#374151',
                  fontSize: 16,
                },
                img: {
                  marginVertical: 16,
                  borderRadius: 12,
                  maxWidth: '100%',
                },
                h1: {
                  marginTop: 20,
                  marginBottom: 12,
                  fontSize: 28,
                  fontWeight: '700',
                  color: isDark ? '#f3f4f6' : '#111827',
                  lineHeight: 34,
                },
                h2: {
                  marginTop: 18,
                  marginBottom: 10,
                  fontSize: 22,
                  fontWeight: '700',
                  color: isDark ? '#f3f4f6' : '#111827',
                  lineHeight: 28,
                },
                h3: {
                  marginTop: 14,
                  marginBottom: 8,
                  fontSize: 18,
                  fontWeight: '600',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                  lineHeight: 24,
                },
                h4: {
                  marginTop: 12,
                  marginBottom: 6,
                  fontSize: 16,
                  fontWeight: '600',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                },
                h5: {
                  marginTop: 10,
                  marginBottom: 6,
                  fontSize: 14,
                  fontWeight: '600',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                },
                h6: {
                  marginTop: 10,
                  marginBottom: 6,
                  fontSize: 12,
                  fontWeight: '600',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                },
                ul: {
                  marginVertical: 12,
                },
                ol: {
                  marginVertical: 12,
                },
                li: {
                  marginVertical: 6,
                  lineHeight: 24,
                  color: isDark ? '#d1d5db' : '#374151',
                  fontSize: 16,
                },
                a: {
                  color: isDark ? '#60a5fa' : '#2563eb',
                  textDecorationLine: 'underline',
                },
                blockquote: {
                  marginVertical: 12,
                  marginHorizontal: 16,
                  paddingLeft: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: isDark ? '#4b5563' : '#cbd5e1',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontStyle: 'italic',
                },
                strong: {
                  fontWeight: '700',
                  color: isDark ? '#f3f4f6' : '#111827',
                },
                em: {
                  fontStyle: 'italic',
                  color: isDark ? '#d1d5db' : '#374151',
                },
                code: {
                  backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
                  color: isDark ? '#fecaca' : '#dc2626',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  fontFamily: 'Menlo',
                  fontSize: 14,
                },
                pre: {
                  backgroundColor: isDark ? '#111827' : '#f9fafb',
                  color: isDark ? '#e5e7eb' : '#1f2937',
                  padding: 12,
                  borderRadius: 8,
                  marginVertical: 12,
                  overflow: 'hidden',
                },
              }}
              baseStyle={{
                fontSize: 16,
                lineHeight: 24,
                color: isDark ? '#e5e7eb' : '#374151',
              }}
            />
          </View>

          {/* Category Tags */}
          {post._embedded?.['wp:term']?.[0] && post._embedded['wp:term'][0].length > 0 && (
            <View className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Text className="mb-3 font-semibold text-gray-900 dark:text-white">Categories</Text>
              <View className="flex-row flex-wrap gap-2">
                {post._embedded['wp:term'][0].map((term: any) => (
                  <View
                    key={term.id}
                    className="rounded-full bg-blue-100 px-4 py-2 dark:bg-blue-900/30">
                    <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      {term.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-24" />
      </ScrollView>
    </Animated.View>
  );
}
