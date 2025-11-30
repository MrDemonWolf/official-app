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
import BlogCard from "../components/ui/blog-card";

import { fetchPosts } from "../services/wordpress/wp-client";

export default function Blog() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const perPage = 10;

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

  return (
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? colors.black : colors.white,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom + 16,
      }}
    >
      {!posts || posts.length === 0 ? (
        <View
          style={{
            flex: 1,
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
          style={{ flex: 1, paddingBottom: insets.bottom + 16 }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <BlogCard post={item} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loading ? <ActivityIndicator style={{ margin: 16 }} /> : null
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
          // ensure bounce/overscroll available for pull-to-refresh
          alwaysBounceVertical={true}
        />
      )}
    </SafeAreaView>
  );
}
