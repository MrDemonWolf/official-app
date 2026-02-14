import { getDatabase } from '@/lib/database';
import type { BookmarkedPost } from '@/types/bookmark';

export async function addBookmark(bookmark: Omit<BookmarkedPost, 'id' | 'bookmarked_at'>): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO bookmarks (post_id, post_type, title, excerpt, featured_image_url, content_html, author_name, date, link)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    bookmark.post_id,
    bookmark.post_type,
    bookmark.title,
    bookmark.excerpt,
    bookmark.featured_image_url,
    bookmark.content_html,
    bookmark.author_name,
    bookmark.date,
    bookmark.link
  );
}

export async function removeBookmark(postId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM bookmarks WHERE post_id = ?', postId);
}

export async function isBookmarked(postId: number): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM bookmarks WHERE post_id = ?',
    postId
  );
  return (result?.count ?? 0) > 0;
}

export async function getBookmarks(type?: string): Promise<BookmarkedPost[]> {
  const db = await getDatabase();
  if (type) {
    return db.getAllAsync<BookmarkedPost>(
      'SELECT * FROM bookmarks WHERE post_type = ? ORDER BY bookmarked_at DESC',
      type
    );
  }
  return db.getAllAsync<BookmarkedPost>(
    'SELECT * FROM bookmarks ORDER BY bookmarked_at DESC'
  );
}

export async function clearAllBookmarks(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM bookmarks');
}

export async function getBookmarkedContent(postId: number): Promise<BookmarkedPost | null> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<BookmarkedPost>(
    'SELECT * FROM bookmarks WHERE post_id = ?',
    postId
  );
  return result ?? null;
}
