import type { SQLiteRunResult } from 'expo-sqlite';

import { getDatabase } from '@/lib/database';
import type { BookmarkedPost } from '@/types/bookmark';

export async function addBookmark(bookmark: Omit<BookmarkedPost, 'id' | 'bookmarked_at'>): Promise<void> {
  const db = await getDatabase();
  (await db.sql`INSERT OR REPLACE INTO bookmarks (post_id, post_type, title, excerpt, featured_image_url, content_html, author_name, date, link)
     VALUES (${bookmark.post_id}, ${bookmark.post_type}, ${bookmark.title}, ${bookmark.excerpt}, ${bookmark.featured_image_url}, ${bookmark.content_html}, ${bookmark.author_name}, ${bookmark.date}, ${bookmark.link})`) as SQLiteRunResult;
}

export async function removeBookmark(postId: number): Promise<void> {
  const db = await getDatabase();
  (await db.sql`DELETE FROM bookmarks WHERE post_id = ${postId}`) as SQLiteRunResult;
}

export async function isBookmarked(postId: number): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.sql<{ count: number }>`SELECT COUNT(*) as count FROM bookmarks WHERE post_id = ${postId}`.first();
  return (result?.count ?? 0) > 0;
}

export async function getBookmarks(type?: string): Promise<BookmarkedPost[]> {
  const db = await getDatabase();
  if (type) {
    return db.sql<BookmarkedPost>`SELECT * FROM bookmarks WHERE post_type = ${type} ORDER BY bookmarked_at DESC`;
  }
  return db.sql<BookmarkedPost>`SELECT * FROM bookmarks ORDER BY bookmarked_at DESC`;
}

export async function clearAllBookmarks(): Promise<void> {
  const db = await getDatabase();
  (await db.sql`DELETE FROM bookmarks`) as SQLiteRunResult;
}

export async function getBookmarkedContent(postId: number): Promise<BookmarkedPost | null> {
  const db = await getDatabase();
  const result = await db.sql<BookmarkedPost>`SELECT * FROM bookmarks WHERE post_id = ${postId}`.first();
  return result ?? null;
}
