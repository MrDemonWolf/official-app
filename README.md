# MrDemonWolf Official App 📱

![App Banner](/banner.png)

My company mobile app — a small, honest space for notes, projects, and a simple portfolio. Built with Expo + React Native and styled with NativeWind. Nothing flashy, just the tools I use and the things I’m learning.

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

## Environment Configuration

To set up your environment variables, copy `.env.example` to `.env.local` (or configure them directly in EAS for deployment) and update the values as described below.

```dotenv
# .env.example
EXPO_PUBLIC_WORDPRESS_API_URL=
EXPO_PUBLIC_GRAVATAR_MD5=
# EXPO_PUBLIC_GRAVATAR_EMAIL=
```

### Required Variables

- **`EXPO_PUBLIC_WORDPRESS_API_URL`**: (Required for Blog feature)
  Set this to the base REST API endpoint of your WordPress site.
  Example: `https://your-wordpress-site.com/wp-json`

### Optional Variables

- **`EXPO_PUBLIC_GRAVATAR_MD5`**: (Recommended for Avatar)
  Provide the precomputed MD5 hash of your **lowercased and trimmed** email address for Gravatar. This is the preferred method as it avoids the need for additional dependencies.

  To compute the MD5 hash:
  - **macOS:**
    ```bash
    echo -n "you@example.com" | md5
    ```
  - **OpenSSL (any OS):**
    ```bash
    printf "you@example.com" | openssl md5 | awk '{print $2}'
    ```

- **`EXPO_PUBLIC_GRAVATAR_EMAIL`**: (Alternative for Avatar)
  If you prefer to use your email directly instead of a precomputed MD5 hash, set this variable. Note that this option requires the `expo-crypto` package for runtime hashing.

  To install `expo-crypto`:

  ```bash
  pnpm dlx expo install expo-crypto
  ```

  _Note: The app prioritizes `EXPO_PUBLIC_GRAVATAR_MD5`. It also recognizes older variable names like `EXPO_PUBLIC_GRAVATAR_HASH`, `GRAVATAR_MD5`, and `GRAVATAR_HASH` for backward compatibility._

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
- The avatar on Home uses the owner Gravatar MD5 (or email if configured).

## Change Log

### v1.0.0 (Unreleased)

## Development

### Prerequisites

- Node.js 20.x or 22.x
- pnpm 9.x
- Xcode (for iOS) / Android Studio (for Android)

### Scripts

- `pnpm start` — Expo dev server
- `pnpm ios` — Run on iOS simulator
- `pnpm android` — Run on Android emulator
- `pnpm lint` — Lint with ESLint

## License

![GitHub license](https://img.shields.io/github/license/MrDemonWolf/fluffboost.svg?style=for-the-badge&logo=github)

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out to us on Discord!

- Discord: [Join my server](https://mrdwolf.com/discord)

Thank you for choosing FluffBoost to add motivation and positivity to your Discord server!

Made with ❤️ by <a href="https://www.mrdemonwolf.com">MrDemonWolf, Inc.</a>
