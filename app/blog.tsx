import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { BlogCard, fetchPosts } from "../components/ui";

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const perPage = 10;
  const insets = useSafeAreaInsets();

  const loadPage = async (p = 1, append = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetchPosts({ page: p, perPage });
      if (append) setPosts((prev) => [...prev, ...res.posts]);
      else setPosts(res.posts);
      setTotalPages(res.totalPages);
      setPage(p);
    } catch (err) {
      console.warn("Error loading posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchPosts({ page: 1, perPage });
        setPosts(res.posts);
        setTotalPages(res.totalPages);
        setPage(1);
      } catch (err) {
        console.warn("Error loading posts", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPage(1, false);
    setRefreshing(false);
  };

  const handleEndReached = () => {
    if (!loading && page < totalPages) {
      loadPage(page + 1, true);
    }
  };

  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? colors.black : colors.white,
      }}
    >
      {!posts || posts.length === 0 ? (
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
          }}
          className="items-center justify-center px-4"
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-gray-600 dark:text-white">
              No posts found
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <BlogCard post={item} />}
          contentContainerStyle={{
            paddingTop: 0,
            paddingBottom: insets.bottom,
            paddingHorizontal: 16,
          }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loading ? <ActivityIndicator style={{ margin: 16 }} /> : null
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}
