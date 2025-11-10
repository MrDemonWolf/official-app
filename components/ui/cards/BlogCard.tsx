import { TouchableOpacity, View, Text, Image } from 'react-native';
import { BlogCardProps } from '../../types';

export function BlogCard({ post, onPress, formatDate, stripHtml }: BlogCardProps) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const altText = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || 'Featured image';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View className="mb-5 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
        {featuredImage && (
          <Image
            source={{ uri: featuredImage }}
            className="h-52 w-full bg-gray-300"
            accessibilityLabel={altText}
          />
        )}
        <View className="p-5">
          <Text className="text-base leading-6 font-bold text-gray-900 dark:text-white">
            {post.title.rendered}
          </Text>
          <Text className="mt-3 text-sm leading-5 text-gray-600 dark:text-gray-300">
            {stripHtml(post.excerpt.rendered)}
          </Text>
          <View className="mt-4 flex-row items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
              📅 {formatDate(post.date)}
            </Text>
            <View className="rounded-full bg-blue-100 px-3 py-1 dark:bg-blue-900/30">
              <Text className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                Read more →
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
