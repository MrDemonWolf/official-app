import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('mrdemonwolf.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER UNIQUE NOT NULL,
      post_type TEXT NOT NULL DEFAULT 'post',
      title TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '',
      featured_image_url TEXT,
      content_html TEXT NOT NULL DEFAULT '',
      author_name TEXT,
      date TEXT NOT NULL DEFAULT '',
      bookmarked_at TEXT NOT NULL DEFAULT (datetime('now')),
      link TEXT NOT NULL DEFAULT ''
    );
  `);

  return db;
}
