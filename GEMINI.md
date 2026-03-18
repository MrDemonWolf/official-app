# GEMINI.md

This file provides foundational instructions and project context for Gemini CLI when working in the `official-app` repository.

## Project Overview

The **MrDemonWolf Official App** is a cross-platform mobile application (iOS, Android, and Web) built with **Expo SDK 55** and **React Native 0.83** (utilizing the New Architecture). It serves as a personal portfolio and blog reader, pulling content dynamically from a WordPress backend.

### Core Tech Stack

- **Framework:** Expo SDK 55 (React Native 0.83)
- **Navigation:** Expo Router (file-based routing)
- **Data Fetching:** React Query (@tanstack/react-query) with WordPress REST API
- **Styling:** NativeWind (Tailwind CSS v4) with light/dark mode support
- **Local Storage:** `expo-sqlite` for bookmarks, `AsyncStorage` for settings/persistence
- **Notifications:** `expo-notifications` with TailSignal backend and iOS Notification Service Extension
- **Security:** Firebase App Check (App Attest/Play Integrity) for contact form protection
- **Package Manager:** Bun (preferred) or pnpm

## Project Structure

The project follows a `src/` directory convention to keep the root clean.

```text
src/
├── app/            # Expo Router file-based routing
├── assets/         # Images, icons, and fonts
├── components/     # Reusable UI components
├── contexts/       # React Context providers (Settings, etc.)
├── hooks/          # Custom React hooks (React Query, Haptics, etc.)
├── lib/            # Shared utilities (HTML parsing, WP helpers)
├── services/       # API and Infrastructure layers (WP, Firebase, SQLite)
├── types/          # TypeScript type definitions
└── global.css      # Tailwind/NativeWind entry point

targets/            # Native target extensions (e.g., Notification Service)
```

## Building and Running

Key commands for development and building:

| Task | Command |
|---|---|
| **Install Dependencies** | `bun install` |
| **Start Dev Server** | `bun start` (Starts Expo with `development` variant) |
| **Run on iOS** | `bun ios` |
| **Run on Android** | `bun android` |
| **Run on Web** | `bun web` |
| **Linting** | `bun lint` |
| **Type Checking** | `bun type-check` |
| **Prebuild** | `bun prebuild` |
| **Production Build** | `eas build --platform [ios|android]` |

## Development Conventions

### Routing & Navigation

- Use **Expo Router** with file-based routing in `src/app/`.
- Platform-specific layouts: `_layout.tsx` (iOS/Web) and `_layout.android.tsx` (Android).
- Prefer `process.env.EXPO_OS` over `Platform.OS` for branching logic.

### Data Fetching

- Centralize all query keys in `src/hooks/query-keys.ts`.
- All WordPress interactions should go through `src/services/wordpress.ts`.
- Use React Query for all server state; avoid local state for data fetched from APIs.

### Styling & Theming

- Use **NativeWind** classes for all styling.
- Support both light and dark modes using the `dark:` prefix.
- Use `src/hooks/use-color-scheme.ts` to resolve the current theme (system vs. user preference).

### State & Persistence

- Use `src/contexts/settings-context.tsx` for global app settings.
- Persist critical local data (like bookmarks) in SQLite via `src/services/bookmarks.ts`.
- Persist lightweight settings in `AsyncStorage`.

### Code Quality

- **TypeScript:** Strict mode is enabled. Ensure all new code is fully typed.
- **Path Aliases:** Use `@/*` to reference the `src/` directory (e.g., `import { ... } from '@/components/...'`).
- **React Compiler:** Enabled via `experiments.reactCompiler` in `app.config.ts`. Avoid manual `useMemo` or `useCallback` unless necessary for specific stability reasons outside of rendering.

## Important Configurations

- **Environment Variables:** Defined in `.env` (based on `.env.example`).
- **App Variants:** Controlled via `APP_VARIANT` (`development` vs `production`).
- **Native Targets:** The `notification-service` target in `targets/` is managed via `@bacons/apple-targets`. Do not modify native projects directly; use the config plugin approach.
