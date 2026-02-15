# MrDemonWolf - Official App

The official MrDemonWolf mobile app — a portfolio and blog reader built with React Native and Expo, powered by a WordPress backend. Browse blog posts, learn about MrDemonWolf, and stay connected across iOS and Android.

Built with modern native technologies for a smooth, native-feeling experience on every platform.

## Features

- **About** — Profile screen with circular avatar, role tagline, social links, and bio pulled directly from a WordPress user.
- **Blog** — Infinite scroll blog feed with featured images, author metadata, categories, and full post reading with rich HTML rendering.
- **Portfolio** — Coming soon.
- **Contact** — Coming soon (Gravity Forms integration).
- **Push Notifications** — Subscribe to new blog post notifications via TailSignal, with automatic device registration and deep linking to posts.
- **Settings** — Theme (light/dark/auto), font size scaling, haptic feedback toggle (iOS), notifications toggle, and cache management.
- **Tab Persistence** — Remembers your last visited tab across app launches.
- **Platform Optimized** — Native tabs with SF Symbols on iOS, Material Design on Android.

## Tech Stack

- **Framework:** Expo SDK 54 with React Native 0.81 (New Architecture)
- **Navigation:** Expo Router with native tabs and file-based routing
- **Data Fetching:** React Query with WordPress REST API
- **Styling:** NativeWind (Tailwind CSS) with light/dark mode support
- **Animations:** React Native Reanimated for parallax effects and animated controls
- **State:** React Context with AsyncStorage persistence
- **Platforms:** iOS, Android, and web

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm 9.x
- Xcode (for iOS development)
- Android Studio (for Android development)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/MrDemonWolf/official-app.git
   cd official-app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env` (see [Environment Variables](#environment-variables) below)

5. Start the development server:
   ```bash
   pnpm start
   ```

### Development Scripts

- `pnpm start` — Start Expo dev server
- `pnpm ios` — Run on iOS simulator
- `pnpm android` — Run on Android emulator
- `pnpm web` — Start for web
- `pnpm lint` — Run ESLint
- `pnpm type-check` — Run TypeScript type checking
- `pnpm prebuild` — Generate native projects
- `pnpm prebuild:clean` — Clean and regenerate native projects

### Environment Variables

Copy `.env.example` to `.env` and configure the values for your WordPress site:

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_WORDPRESS_API_URL` | WordPress REST API base URL (e.g. `https://yoursite.com/wp-json/wp/v2`) |
| `EXPO_PUBLIC_WORDPRESS_USER_ID` | WordPress user ID for the About screen profile (defaults to `1`) |
| `EXPO_PUBLIC_APP_VARIANT` | App variant — `development` or `production` |
| `EXPO_PUBLIC_GF_API_URL` | Gravity Forms REST API base URL for the contact form |
| `EXPO_PUBLIC_GF_CONTACT_FORM_ID` | Gravity Forms form ID for the contact form |
| `EXPO_PUBLIC_TAILSIGNAL_API_URL` | TailSignal REST API base URL for push notification device registration (requires the [TailSignal](https://tailsignal.com) WordPress plugin) |

### WordPress ACF Setup

The About screen pulls social links and a role/tagline from [ACF (Advanced Custom Fields)](https://www.advancedcustomfields.com/) user fields. Install the ACF plugin on your WordPress site, then create a field group:

1. Go to **ACF > Field Groups** and create a new group (e.g. "User Profile")
2. Add the following fields:

   | Field Label | Field Name | Field Type |
   |---|---|---|
   | Role / Title | `role_title` | Text |
   | GitHub URL | `github_url` | URL |
   | Discord URL | `discord_url` | URL |
   | Twitter / X URL | `twitter_url` | URL |
   | Twitch URL | `twitch_url` | URL |
   | YouTube URL | `youtube_url` | URL |
   | Website URL | `website_url` | URL |

3. Set the **Location** rule to: **User Role** is equal to **All**
4. Under **Settings**, enable **Show in REST API**
5. Fill in the fields on your WordPress user profile

Only fields with values will show as icons on the About screen. If no ACF fields are configured, the social links row simply won't appear.

### Code Quality

This project uses:

- **ESLint** for code linting
- **TypeScript** for type safety
- **React Compiler** for automatic optimization
- **Typed Routes** for compile-time route checking

## Building

Builds are managed through [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## License

![GitHub license](https://img.shields.io/github/license/MrDemonWolf/official-app.svg?style=for-the-badge&logo=github)

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out!

- Discord: [Join my server](https://mrdwolf.net/discord)

Made with ❤️ by <a href="https://www.mrdemonwolf.com">MrDemonWolf, Inc.</a>
