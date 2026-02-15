# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server
pnpm start              # Start Expo dev server
pnpm ios                # Run on iOS simulator
pnpm android            # Run on Android emulator
pnpm web                # Start for web

# Code quality
pnpm lint               # Run ESLint
pnpm type-check         # Run TypeScript type checking

# Build
pnpm prebuild           # Generate native projects
pnpm prebuild:clean     # Clean and regenerate native projects

# EAS (run via zsh -l for PATH)
eas build --platform ios        # Build for iOS
eas build --platform android    # Build for Android
eas submit --platform ios       # Submit to App Store
eas submit --platform android   # Submit to Play Store
eas credentials                 # Manage signing credentials
```

## Architecture

This is an Expo SDK 55 app using React Native 0.83 with the New Architecture enabled. It's a personal portfolio/blog app pulling content from a WordPress backend.

### Project Structure

Source code lives under `src/` to keep the root clean. Expo Router auto-detects `src/app/`.

```
src/
├── app/                    # Expo Router file-based routing
├── assets/images/          # App icons, splash, favicons
├── components/             # Reusable React components
├── contexts/               # React Context providers (settings)
├── hooks/                  # Custom React hooks (queries, haptics, form state)
├── lib/                    # Utilities (HTML parsing, font scale, WP helpers)
├── services/               # API layers (WordPress REST, Gravity Forms, notifications, bookmarks)
├── types/                  # TypeScript type definitions
└── global.css              # Tailwind/NativeWind imports
```

### Navigation (Expo Router with file-based routing)

- `src/app/_layout.tsx` — Root layout with Stack, QueryClientProvider, SettingsProvider, and theme
- `src/app/(tabs)/` — Tab group with 5 tabs: About, Blog, Portfolio, Contact, Settings

Tab layouts are platform-specific:
- `_layout.tsx` — iOS uses `NativeTabs` with SF Symbols, tab persistence via `useSegments()`
- `_layout.android.tsx` — Android uses `Tabs` with MaterialIcons, same persistence logic

Each tab has its own `(group)/_layout.tsx` Stack and `index.tsx` screen.

#### Routes

| Tab | Route | Status |
|-----|-------|--------|
| About | `(index)/index.tsx` | Profile screen with avatar, role, social links, bio from WP user |
| Blog | `(blog)/index.tsx` | Infinite scroll blog list with cache pre-population |
| Blog Post | `blog/[id].tsx` | Detail screen with HTML content rendering |
| Bookmarks | `(blog)/bookmarks.tsx` | Saved posts list (SQLite-backed) |
| Portfolio | `(portfolio)/index.tsx` | Portfolio showcase |
| Portfolio Item | `portfolio/[id].tsx` | Portfolio detail screen |
| Contact | `(contact)/index.tsx` | Coming soon placeholder (form being finalized) |
| Settings | `(settings)/index.tsx` | Theme, font size, haptics, notifications, cache, app info |

### Platform-Specific Files

- `.tsx` files are the default (iOS on native, all platforms on web)
- `.android.tsx` overrides for Android-specific implementations
- Use `process.env.EXPO_OS` instead of `Platform.OS`

### Data Fetching

- **React Query** (`@tanstack/react-query`) for all server state
- `src/hooks/query-keys.ts` — Centralized query key factory
- `src/services/wordpress.ts` — WordPress REST API (users, posts, media)
- `src/services/gravity-forms.ts` — Gravity Forms submission
- `src/services/notifications.ts` — TailSignal push notification registration
- `src/services/bookmarks.ts` — SQLite-backed local bookmarks
- Blog list pre-populates individual post caches for instant detail screen rendering

### Hooks

- `use-about.ts` — Fetches WP user data for the About screen
- `use-posts.ts` / `use-post.ts` — Blog post queries
- `use-search-posts.ts` — Infinite search across posts
- `use-categories.ts` — Category listing for blog filter
- `use-portfolio.ts` — Portfolio item queries
- `use-bookmarks.ts` — Bookmark CRUD (useBookmarks, useIsBookmarked, useToggleBookmark, useClearBookmarks)
- `use-notifications.ts` — Push notification registration and response handling
- `use-contact-form.ts` / `use-contact-form-state.ts` — Contact form submission
- `use-color-scheme.ts` — Theme resolution (system + user preference)
- `use-haptics.ts` — Haptic feedback gated by settings (iOS only)
- `use-share.ts` — Native share sheet

### Settings & Persistence

- `src/contexts/settings-context.tsx` — Global settings via Context + AsyncStorage
- Manages: theme preference, font size, haptics toggle (iOS), notifications toggle, last active tab
- Tab persistence restores the last visited tab on cold launch

### Theming

- Light/dark mode with user preference override (light, dark, auto)
- `src/hooks/use-color-scheme.ts` combines system scheme with user preference
- Uses NativeWind/Tailwind classes (`dark:`) and inline styles

### Haptics

- `src/hooks/use-haptics.ts` wraps `expo-haptics` with settings awareness
- Provides `impact()`, `selection()`, `notification()` — all gated by `settings.hapticsEnabled`
- iOS only (`process.env.EXPO_OS === 'ios'`)

### Push Notifications

- `src/services/notifications.ts` — Registers/unregisters Expo push tokens with TailSignal backend
- `src/hooks/use-notifications.ts` — Manages registration lifecycle and deep-link navigation on tap
- Gated by `settings.notificationsEnabled`

### Components

- `blog-post-card.tsx` — Blog card with featured image, metadata, haptic feedback
- `bookmark-button.tsx` — Toggle bookmark button for posts
- `category-filter.tsx` — Category filter bar for blog
- `coming-soon.tsx` — Placeholder for incomplete sections
- `html-content.tsx` — WordPress HTML renderer (headings, lists, quotes, code, images, links)
- `portfolio-card.tsx` — Portfolio item card

### Path Aliases

TypeScript path alias `@/*` maps to `src/` (configured in `tsconfig.json`).

### EAS & Store Configuration

- **Owner:** `mrdemonwolf-org`
- **EAS Project ID:** `4a220b17-d746-48f1-9f46-d83a0a933b40`
- **iOS:** Distribution cert + provisioning profile configured
- **Android:** JKS keystore + Google Service Account for Play Store submissions
- **Bundle IDs:** `com.mrdemonwolf.OfficialApp` (prod) / `com.mrdemonwolf.OfficialApp.dev` (dev)
- Build profiles: `development` (internal) and `production` (store) with `appVersionSource: "remote"` and auto-increment

### Experimental Features

- Typed routes enabled (`experiments.typedRoutes`)
- React Compiler enabled (`experiments.reactCompiler`)
