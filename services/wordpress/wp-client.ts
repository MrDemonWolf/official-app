import Constants from "expo-constants";

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

export type FetchPostsResult = {
  posts: any[];
  totalPages: number;
  total: number;
};

export async function fetchPosts({
  page = 1,
  perPage = 10,
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
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WP API error ${res.status}: ${text}`);
  }

  const posts = await res.json();
  const totalPages = Number(
    res.headers.get("X-WP-TotalPages") ||
      res.headers.get("x-wp-totalpages") ||
      1
  );
  const total = Number(
    res.headers.get("X-WP-Total") || res.headers.get("x-wp-total") || 0
  );

  return {
    posts: Array.isArray(posts) ? posts : [],
    totalPages: Number.isFinite(totalPages) ? totalPages : 1,
    total,
  };
}

export default { fetchPosts };
