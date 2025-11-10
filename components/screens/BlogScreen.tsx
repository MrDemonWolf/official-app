import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { fetchBlogPosts, WordPressPost } from '../../services/wordpressApi';
import { BlogCard } from '../ui/cards/BlogCard';
import { BlogPostDetail } from '../ui/cards/BlogPostDetail';

export function BlogScreen() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState<WordPressPost | null>(null);

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

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const blogPosts = await fetchBlogPosts(1);
      setPosts(blogPosts);
      setPage(2);
      setHasMore(blogPosts.length > 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      console.error('Error refreshing posts:', err);
    } finally {
      setRefreshing(false);
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
      month: 'short',
      day: 'numeric',
    });
  };

  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/gu, '')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 120);
  };

  // If a post is selected, show the detail view
  if (selectedPost) {
    return <BlogPostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-600 dark:text-gray-400">Loading articles...</Text>
        </View>
      ) : error ? (
        <ScrollView className="flex-1 px-6 dark:bg-gray-900">
          <View className="mt-8 rounded-2xl bg-red-50 p-6 dark:bg-red-950/30">
            <Text className="text-lg font-bold text-red-900 dark:text-red-100">
              ⚠️ Error Loading Posts
            </Text>
            <Text className="mt-3 text-sm text-red-800 dark:text-red-200">{error}</Text>
            <TouchableOpacity
              onPress={onRefresh}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 active:bg-red-700">
              <Text className="text-center font-semibold text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : posts.length === 0 ? (
        <ScrollView className="flex-1 px-6">
          <View className="mt-16 rounded-2xl bg-yellow-50 p-6 dark:bg-yellow-950/30">
            <Text className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
              📝 No Articles Yet
            </Text>
            <Text className="mt-2 text-sm text-yellow-800 dark:text-yellow-200">
              Check your EXPO_PUBLIC_WORDPRESS_URL in your .env file.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1 px-6 pb-24 dark:bg-gray-900"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isCloseToBottom =
              contentSize.height - layoutMeasurement.height - contentOffset.y < 500;
            if (isCloseToBottom && hasMore && !loadingMore) {
              loadMorePosts();
            }
          }}
          scrollEventThrottle={400}>
          {/* Header */}
          <View className="mb-6 pt-12">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">Articles</Text>
            <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Discover latest insights and stories
            </Text>
          </View>
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onPress={() => setSelectedPost(post)}
              formatDate={formatDate}
              stripHtml={stripHtml}
            />
          ))}
          {loadingMore && (
            <View className="mb-6 items-center justify-center py-6">
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Loading more articles...
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
