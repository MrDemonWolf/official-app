import Constants from "expo-constants";
import type { FetchPostsResult, WP_Post } from "./types";

// Logger interface so consumers can provide their own logging implementation
export type WPClientLogger = {
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info?: (...args: any[]) => void;
};

const defaultLogger: WPClientLogger = {
  warn: (...args: any[]) => console.warn("[wp-client]", ...args),
  error: (...args: any[]) => console.error("[wp-client]", ...args),
  info: (...args: any[]) => console.info("[wp-client]", ...args),
};

const resolveApiBase = (): string => {
  const expoConfig =
    (Constants as any).expoConfig || (Constants as any).manifest || {};
  const extra = expoConfig.extra || {};
  const fromExtra =
    extra.EXPO_PUBLIC_WORDPRESS_API_URL || extra.WORDPRESS_API_URL;
  const fromEnv =
    process.env.EXPO_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL;

  return String(fromExtra || fromEnv || "");
};

// In-memory cache for simple caching (url -> { ts, data })
const cache = new Map<string, { ts: number; data: FetchPostsResult }>();
const DEFAULT_TTL = 60 * 1000; // 1 minute

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchWithRetry(
  url: string,
  attempts = 3,
  logger: WPClientLogger = defaultLogger
): Promise<Response> {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      lastErr = err;
      const backoff = Math.pow(2, i) * 250;
      logger.warn(
        `fetch attempt ${i + 1} failed for ${url}, retrying in ${backoff}ms`,
        err
      );
      // jitter
      const jitter = Math.floor(Math.random() * 100);
      await delay(backoff + jitter);
    }
  }
  throw lastErr;
}

export async function fetchPosts({
  page = 1,
  perPage = 10,
  ttl = DEFAULT_TTL,
  force = false,
  attempts = 3,
  logger = defaultLogger,
}: {
  page?: number;
  perPage?: number;
  ttl?: number;
  force?: boolean;
  attempts?: number;
  logger?: WPClientLogger;
} = {}): Promise<FetchPostsResult> {
  const base = resolveApiBase();
  if (!base)
    throw new Error(
      "EXPO_PUBLIC_WORDPRESS_API_URL not configured (check expo Constants.expoConfig.extra)"
    );

  const url = `${base.replace(
    /\/$/,
    ""
  )}/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`;

  if (!force) {
    const cached = cache.get(url);
    if (cached && Date.now() - cached.ts < ttl) {
      logger.info?.("returning cached posts for", url);
      return cached.data;
    }
  }

  const res = await fetchWithRetry(url, attempts, logger);

  const postsJson = await res.json();

  const totalPages = Number(
    res.headers.get("X-WP-TotalPages") ||
      res.headers.get("x-wp-totalpages") ||
      1
  );
  const total = Number(
    res.headers.get("X-WP-Total") || res.headers.get("x-wp-total") || 0
  );

  const result: FetchPostsResult = {
    posts: Array.isArray(postsJson) ? (postsJson as WP_Post[]) : [],
    totalPages: Number.isFinite(totalPages) ? totalPages : 1,
    total,
  };

  cache.set(url, { ts: Date.now(), data: result });
  return result;
}

export function clearCache() {
  cache.clear();
}

export function getCached(url: string) {
  return cache.get(url) || null;
}

export default { fetchPosts, clearCache, getCached };
