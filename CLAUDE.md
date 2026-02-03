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
```

## Architecture

This is an Expo SDK 54 app using React Native 0.81 with the New Architecture enabled.

### Navigation (Expo Router with file-based routing)
- `app/_layout.tsx` - Root layout with Stack navigator and theme provider
- `app/(tabs)/` - Tab group with bottom tab navigation
- `app/modal.tsx` - Modal screen presented over tabs

The app uses `unstable_settings.anchor` to anchor navigation to the tabs group.

### Theming System
- `constants/theme.ts` - Color palette (`Colors`) and platform-specific fonts (`Fonts`)
- `hooks/use-color-scheme.ts` - Platform-specific color scheme detection (re-exports from react-native)
- `hooks/use-theme-color.ts` - Hook for resolving theme-aware colors
- `components/themed-text.tsx` and `components/themed-view.tsx` - Theme-aware base components

### Component Patterns
- **IconSymbol** (`components/ui/icon-symbol.tsx`) - Uses SF Symbols on iOS, MaterialIcons on Android/web. Add new icons to the `MAPPING` object.
- **HapticTab** - Tab bar button with haptic feedback on iOS

### Path Aliases
TypeScript path alias `@/*` maps to the project root (configured in `tsconfig.json`).

### Experimental Features
- Typed routes enabled (`experiments.typedRoutes`)
- React Compiler enabled (`experiments.reactCompiler`)
