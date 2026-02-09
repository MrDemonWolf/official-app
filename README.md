# MrDemonWolf - Official App

The official MrDemonWolf mobile app — a portfolio and blog reader built with React Native and Expo, powered by a WordPress backend. Browse blog posts, learn about MrDemonWolf, and stay connected across iOS and Android.

Built with modern native technologies for a smooth, native-feeling experience on every platform.

## Features

- **About** — Full-width parallax hero with bio and author info pulled directly from WordPress.
- **Blog** — Infinite scroll blog feed with featured images, author metadata, categories, and full post reading with rich HTML rendering.
- **Portfolio** — Coming soon.
- **Contact** — Coming soon (Gravity Forms integration).
- **Settings** — Theme (light/dark/auto), font size scaling, haptic feedback toggle (iOS), and cache management.
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

4. Configure your environment variables in `.env`

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

- Discord: [Join my server](https://mrdwolf.com/discord)

Made with ❤️ by <a href="https://www.mrdemonwolf.com">MrDemonWolf, Inc.</a>
