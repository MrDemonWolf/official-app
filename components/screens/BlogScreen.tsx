import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { fetchBlogPosts, WordPressPost } from '../../services/wordpressApi';

function BlogCard({
  post,
  onPress,
  formatDate,
  stripHtml,
}: {
  post: WordPressPost;
  onPress: () => void;
  formatDate: (date: string) => string;
  stripHtml: (html: string) => string;
}) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const altText = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || 'Featured image';

  return (
    <TouchableOpacity key={post.id} onPress={onPress} activeOpacity={0.7}>
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

function BlogPostDetail({ post, onBack }: { post: WordPressPost; onBack: () => void }) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const altText = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || 'Featured image';
  const slideAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && gestureState.dx > 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          slideAnim.setValue(Math.max(0, 1 - gestureState.dx / 300));
          fadeAnim.setValue(Math.max(0.3, 1 - gestureState.dx / 500));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          // Swipe right threshold - go back
          handleBack();
        } else {
          // Snap back to normal position
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

  const cleanHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/gu, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
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
      <ScrollView className="flex-1">
        {/* Back Button */}
        <View className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <TouchableOpacity onPress={handleBack} className="flex-row items-center">
            <Text className="text-2xl">←</Text>
            <Text className="ml-2 font-semibold text-blue-600 dark:text-blue-400">Back</Text>
          </TouchableOpacity>
        </View>

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
          <View className="mt-6">
            <Text className="text-base leading-7 text-gray-700 dark:text-gray-300">
              {cleanHtml(post.content?.rendered || post.excerpt.rendered)}
            </Text>
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
      month: 'long',
      day: 'numeric',
    });
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/gu, '').substring(0, 150) + '...';
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
          <View className="mb-6 pt-4">
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
          {!hasMore && posts.length > 0 && (
            <View className="mb-24 items-center justify-center rounded-2xl bg-blue-50 p-8 dark:bg-blue-950/30">
              <Text className="text-2xl">✨</Text>
              <Text className="mt-2 text-center text-lg font-bold text-blue-900 dark:text-blue-100">
                All caught up!
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-600 dark:text-gray-400">
                You have viewed all available articles
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
