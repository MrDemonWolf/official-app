import { useState } from 'react';
import { fetchBlogPosts, WordPressPost } from '../../services/wordpressApi';

export function useBlogScreen() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<WordPressPost | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const blogPosts = await fetchBlogPosts();
      setPosts(blogPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts(false);
    setRefreshing(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stripHtml = (html: string): string => {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 120);
  };

  return {
    posts,
    loading,
    selectedPost,
    setSelectedPost,
    refreshing,
    loadPosts,
    handleRefresh,
    formatDate,
    stripHtml,
  };
}
