import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import { fetchBlogPosts, WordPressPost } from '../../services/wordpressApi';

export function BlogScreen() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogPosts = await fetchBlogPosts(1);
      setPosts(blogPosts);
      setPage(2);
      setHasMore(blogPosts.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const morePosts = await fetchBlogPosts(page);
      if (morePosts.length > 0) {
        // Filter out duplicates based on post ID
        const existingIds = new Set(posts.map((p) => p.id));
        const newPosts = morePosts.filter((post) => !existingIds.has(post.id));

        if (newPosts.length > 0) {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch {
      // Treat errors as end of posts
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/gu, '').substring(0, 150) + '...';
  };

  return (
    <View className="flex-1 bg-white pt-4">
      <View className="px-6 py-4">
        <Text className="mb-4 text-3xl font-bold text-gray-900">Blog</Text>

        <View className="mb-4 rounded-lg bg-gray-100 p-4">
          <Text className="text-xl font-semibold text-gray-800">Latest Articles</Text>
          <Text className="mt-2 text-gray-600">Read my latest blog posts and updates.</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : error ? (
        <ScrollView className="flex-1 px-6">
          <View className="mb-4 rounded-lg bg-red-50 p-4">
            <Text className="font-semibold text-red-900">Error loading posts</Text>
            <Text className="mt-2 text-sm text-red-700">{error}</Text>
          </View>
        </ScrollView>
      ) : posts.length === 0 ? (
        <ScrollView className="flex-1 px-6">
          <View className="mb-4 rounded-lg bg-yellow-50 p-4">
            <Text className="font-semibold text-yellow-900">No posts found</Text>
            <Text className="mt-2 text-sm text-yellow-700">
              Check your EXPO_PUBLIC_WORDPRESS_URL in .env
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1 px-6 pb-24"
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isCloseToBottom =
              contentSize.height - layoutMeasurement.height - contentOffset.y < 500;
            if (isCloseToBottom && hasMore && !loadingMore) {
              loadMorePosts();
            }
          }}
          scrollEventThrottle={400}>
          {posts.map((post, index) => {
            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const altText = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || 'Featured image';

            return (
              <View
                key={post.id}
                className={`overflow-hidden rounded-lg bg-blue-50 ${index === posts.length - 1 ? 'mb-4' : 'mb-4'}`}>
                {featuredImage && (
                  <Image
                    source={{ uri: featuredImage }}
                    className="h-48 w-full bg-gray-300"
                    accessibilityLabel={altText}
                  />
                )}
                <View className="p-4">
                  <Text className="font-semibold text-blue-900">{post.title.rendered}</Text>
                  <Text className="mt-2 text-sm text-gray-700">
                    {stripHtml(post.excerpt.rendered)}
                  </Text>
                  <Text className="mt-2 text-xs text-gray-600">{formatDate(post.date)}</Text>
                </View>
              </View>
            );
          })}
          {loadingMore && (
            <View className="mb-6 items-center justify-center py-4">
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text className="mt-2 text-gray-600">Loading more posts...</Text>
            </View>
          )}
          {!hasMore && posts.length > 0 && (
            <View className="mb-24 items-center justify-center rounded-lg bg-blue-50 p-6">
              <Text className="text-center text-lg font-semibold text-blue-900">
                You have reached the end
              </Text>
              <Text className="mt-2 text-center text-sm text-gray-600">
                You have viewed all available blog posts
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
