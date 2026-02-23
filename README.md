# MrDemonWolf - Official App

The official MrDemonWolf mobile app for my website. Portfolio, blog reader, bookmarks, push notifications, and dark mode — built with Expo and React Native.

## Features

- **About** — Profile screen with circular avatar, role tagline, social links, and bio pulled directly from a WordPress user.
- **Blog** — Infinite scroll blog feed with featured images, author metadata, categories, and full post reading with rich HTML rendering.
- **Bookmarks** — Save blog and portfolio posts locally with SQLite-backed offline bookmarks.
- **Portfolio** — Portfolio showcase with detail screens.
- **Contact** — Contact form with invisible device attestation via Firebase App Check and PackRelay/WPForms backend.
- **Push Notifications** — Subscribe to new blog post notifications via TailSignal, with automatic device registration and deep linking to posts.
- **Settings** — Theme (light/dark/auto), font size scaling, haptic feedback toggle (iOS), notifications toggle, and cache management.
- **Tab Persistence** — Remembers your last visited tab across app launches.
- **Platform Optimized** — Native tabs with SF Symbols on iOS, Material Design on Android.

## Tech Stack

- **Framework:** Expo SDK 55 with React Native 0.83 (New Architecture)
- **Navigation:** Expo Router with native tabs and file-based routing
- **Data Fetching:** React Query with WordPress REST API
- **Styling:** NativeWind (Tailwind CSS) with light/dark mode support
- **Icons:** expo-symbols (SF Symbols on iOS), Ionicons via @expo/vector-icons
- **Local Storage:** expo-sqlite for bookmarks, AsyncStorage for settings
- **Notifications:** expo-notifications with TailSignal backend
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
| `EXPO_PUBLIC_PACKRELAY_API_URL` | PackRelay REST API base URL for the contact form (e.g. `https://yoursite.com/wp-json/packrelay/v1`) |
| `EXPO_PUBLIC_PACKRELAY_FORM_ID` | WPForms form ID used by PackRelay for the contact form |
| `EXPO_PUBLIC_TAILSIGNAL_API_URL` | TailSignal REST API base URL for push notification device registration (requires the [TailSignal](https://tailsignal.com) WordPress plugin) |

### WordPress ACF Setup

The About screen pulls social links and a role/tagline from [ACF (Advanced Custom Fields)](https://www.advancedcustomfields.com/) user fields. Install the ACF plugin on your WordPress site, then create a field group:

1. Go to **ACF > Field Groups** and create a new group (e.g. "User Profile")
2. Add a **Text** field for `role_title`
3. Add a **Repeater** field named `social_links` with these sub-fields:

   | Sub-field Label | Field Name | Field Type | Required |
   |---|---|---|---|
   | Platform | `platform` | Select or Text | Yes |
   | URL | `url` | URL | Yes |
   | Icon URL | `icon_url` | URL | No |
   | Label | `label` | Text | No |

4. Set the **Location** rule to: **User Role** is equal to **All**
5. Under **Settings**, enable **Show in REST API**
6. Add social links on your WordPress user profile — each row is a platform + URL

The app bundles icons for 14 platforms: `github`, `discord`, `x`, `twitch`, `youtube`, `facebook`, `instagram`, `bluesky`, `linkedin`, `mastodon`, `threads`, `tiktok`, `reddit`, `steam`. Use `website` for a globe icon. For any other platform, provide an `icon_url` pointing to a remote SVG/PNG and it will be loaded automatically. Add, remove, or reorder links in WordPress without any app changes.

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

### EAS Build Profiles

| Profile | Distribution | Channel | Description |
|---------|-------------|---------|-------------|
| `development` | Internal | `development` | Development client for testing |
| `production` | Store | `production` | Production build with auto-increment versioning |

## License

![GitHub license](https://img.shields.io/github/license/MrDemonWolf/official-app.svg?style=for-the-badge&logo=github)

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out!

- Discord: [Join my server](https://mrdwolf.net/discord)

Made with ❤️ by <a href="https://www.mrdemonwolf.com">MrDemonWolf, Inc.</a>
