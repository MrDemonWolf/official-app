import Constants from "expo-constants";

export type GravatarOptions = {
  /** Image size in pixels (1-2048) */
  size?: number;
  /** Default image type if email has no Gravatar */
  defaultImage?:
    | "404"
    | "mp"
    | "identicon"
    | "monsterid"
    | "wavatar"
    | "retro"
    | "robohash"
    | "blank";
  /** Maximum rating (g, pg, r, x) */
  rating?: "g" | "pg" | "r" | "x";
  /** Force default image even if Gravatar exists */
  forceDefault?: boolean;
};

/**
 * Generate a Gravatar URL for an email address
 * @param email - Email address associated with Gravatar
 * @param options - Optional Gravatar configuration
 * @returns Gravatar image URL
 */
function buildUrlFromHash(hash: string, options: GravatarOptions = {}): string {
  const params = new URLSearchParams();
  if (options.size) params.append("s", String(options.size));
  if (options.defaultImage) params.append("d", options.defaultImage);
  if (options.rating) params.append("r", options.rating);
  if (options.forceDefault) params.append("f", "y");
  const qs = params.toString();
  return `https://www.gravatar.com/avatar/${hash}${qs ? `?${qs}` : ""}`;
}

export async function getGravatarUrl(
  email: string,
  options: GravatarOptions = {}
): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    // Lazy import to avoid requiring expo-crypto unless needed
    const Crypto = await import("expo-crypto");
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.MD5,
      normalizedEmail
    );
    return buildUrlFromHash(hash, options);
  } catch (err) {
    console.warn(
      "[gravatar] expo-crypto not installed. Prefer configuring EXPO_PUBLIC_GRAVATAR_MD5."
    );
    return "";
  }
}

/**
 * Get Gravatar URL using email from environment config
 * @param options - Optional Gravatar configuration
 * @returns Gravatar image URL or empty string if no email configured
 */
export async function getGravatarUrlFromEnv(
  options: GravatarOptions = {}
): Promise<string> {
  const expoConfig =
    (Constants as any).expoConfig || (Constants as any).manifest || {};
  const extra = expoConfig.extra || {};

  // Prefer precomputed MD5 hash if provided (supports multiple env names)
  const preHash =
    extra.EXPO_PUBLIC_GRAVATAR_MD5 ||
    extra.EXPO_PUBLIC_GRAVATAR_HASH ||
    extra.EXPO_PUBLIC_GRAVAR_MD5 || // legacy misspelling support
    extra.GRAVATAR_MD5 ||
    extra.GRAVATAR_HASH ||
    process.env.EXPO_PUBLIC_GRAVATAR_MD5 ||
    process.env.EXPO_PUBLIC_GRAVATAR_HASH ||
    process.env.EXPO_PUBLIC_GRAVAR_MD5 || // legacy misspelling support
    process.env.GRAVATAR_MD5 ||
    process.env.GRAVATAR_HASH ||
    "";
  if (preHash) {
    return buildUrlFromHash(String(preHash), options);
  }

  const email =
    extra.EXPO_PUBLIC_GRAVATAR_EMAIL ||
    extra.GRAVATAR_EMAIL ||
    process.env.EXPO_PUBLIC_GRAVATAR_EMAIL ||
    process.env.GRAVATAR_EMAIL ||
    "";

  if (!email) {
    console.warn(
      "[gravatar] No email or hash configured (EXPO_PUBLIC_GRAVATAR_EMAIL or EXPO_PUBLIC_GRAVATAR_HASH)"
    );
    return "";
  }

  return getGravatarUrl(email, options);
}
