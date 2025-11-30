# MrDemonWolf Official App 📱

![App Banner](assets/images/banner.jpg)

My personal mobile app — a small, honest space for notes, projects, and a simple portfolio. Built with Expo + React Native and styled with NativeWind. Nothing flashy, just the tools I use and the things I’m learning.

## Features

- **Home/About**: A personal intro with a Gravatar avatar.
- **Blog**: Pulls posts from a WordPress JSON API.
- **Portfolio**: A simple showcase of recent work and experiments.
- **Contact**: Quick links to reach me.
- **Polished UI**: NativeWind styling, dark mode, safe-area aware.
- **Expo Router**: File-based routing for tabs and screens.

## Getting Started

1. Install dependencies

```bash
pnpm install
```

2. Configure environment

Copy `.env.example` to `.env.local` (or set env in EAS) and update the values:

```dotenv
# WordPress API base (required for Blog)
EXPO_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json

# Preferred (privacy): precomputed MD5 of your email for Gravatar
EXPO_PUBLIC_GRAVATAR_MD5=your_email_md5_hash_here

# Optional alternative if you don't use MD5 (requires expo-crypto)
# EXPO_PUBLIC_GRAVATAR_EMAIL=you@example.com
```

3. Run the app

```bash
pnpm start        # Expo dev server
pnpm ios          # iOS simulator (requires Xcode)
pnpm android      # Android emulator (requires Android Studio)
pnpm web          # Run in the browser
```

## Usage

- Navigate via the bottom tabs: `Home`, `Blog`, `Portfolio`, `Contact`.
- The Blog tab fetches posts from your configured WordPress API.
- The avatar on Home uses your Gravatar MD5 (or email if configured).

## Change Log

### Version 1.0.0 (2025-11-29)

#### New

- Initial release with Home, Blog, Portfolio, and Contact tabs
- NativeWind styling with responsive spacing and dark mode
- Gravatar avatar support via `EXPO_PUBLIC_GRAVATAR_MD5`
- WordPress posts via `EXPO_PUBLIC_WORDPRESS_API_URL`

## Development

### Prerequisites

- Node.js 20.x or 22.x
- pnpm 9.x
- Xcode (for iOS) / Android Studio (for Android)

### Scripts

- `pnpm start` — Expo dev server
- `pnpm ios` — Run on iOS simulator
- `pnpm android` — Run on Android emulator
- `pnpm web` — Run in browser
- `pnpm reset-project` — Reset the example project scaffold
- `pnpm lint` — Lint with ESLint

## Configuration Notes

### Avatar (Gravatar)

Recommended (no dependency):

1. Compute the MD5 of your email (lowercased, no spaces):

```bash
# macOS
echo -n "you@example.com" | md5

# OpenSSL (any OS)
printf "you@example.com" | openssl md5 | awk '{print $2}'
```

2. Add it to your env:

```dotenv
EXPO_PUBLIC_GRAVATAR_MD5=your_email_md5_hash_here
```

Optional email-based setup (requires hashing at runtime):

```dotenv
EXPO_PUBLIC_GRAVATAR_EMAIL=you@example.com
```

```bash
pnpm dlx expo install expo-crypto
```

The app first tries `EXPO_PUBLIC_GRAVATAR_MD5`. It also recognizes `EXPO_PUBLIC_GRAVATAR_HASH`, `GRAVATAR_MD5`, `GRAVATAR_HASH`, and a legacy misspelling `EXPO_PUBLIC_GRAVAR_MD5`.

### WordPress API

Set `EXPO_PUBLIC_WORDPRESS_API_URL` to your site’s base REST endpoint.

```dotenv
EXPO_PUBLIC_WORDPRESS_API_URL=https://example.com/wp-json
```

## License

![GitHub license](https://img.shields.io/github/license/MrDemonWolf/fluffboost.svg?style=for-the-badge&logo=github)

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out to us on Discord!

- Discord: [Join my server](https://mrdwolf.com/discord)

Thank you for choosing FluffBoost to add motivation and positivity to your Discord server!

Made with ❤️ by <a href="https://www.mrdemonwolf.com">MrDemonWolf, Inc.</a>
