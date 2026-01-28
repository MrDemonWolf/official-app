```instructions
# GitHub Copilot – Repository Instructions (Standard 2026)

## 1. Project Overview & Context

This project is an **Official Expo Mobile App** (2026 Edition). It follows the **Managed Workflow** and leverages the latest stable Expo SDK features.

- **Framework:** Expo SDK (Latest Stable)
- **Navigation:** Expo Router (Strict File-based routing)
- **Runtime:** Hermes JavaScript Engine
- **Architecture:** New Architecture (TurboModules & Fabric) enabled
- **Target Audience:** Production-grade mobile users (iOS/Android)

---

## 2. Global Coding Standards (Expo Skills Aligned)

- **TypeScript First:** All files must be `.ts` or `.tsx`. Prefer strict types over `any`.
- **Functional Components:** Use functional components with hooks. No class components.
- **Declarative UI:** Prefer declarative over imperative code.
- **Naming Conventions:**
  - Components: `PascalCase` (e.g., `PrimaryButton.tsx`)
  - Hooks: `camelCase` starting with `use` (e.g., `useAuth.ts`)
  - Files/Folders: `kebab-case` for non-route files; route files use Expo Router conventions
  - Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

---

## 3. Expo Router & Navigation Patterns

- **Directory:** All routing logic resides in the `/app` directory.
- **Layouts:** Every sub-directory should have a `_layout.tsx` to manage local headers and state.
- **Type Safety:** Use `Typed Routes` via `expo-router`. Avoid manual navigation-param lists when possible.
- **Linking:** Prefer `<Link />` from `expo-router` for accessible navigation.

---

## 4. State Management & Data Fetching

- **Server State:** Prefer `TanStack Query` (React Query) for API calls.
- **Local State:** Use `Zustand` for lightweight global state or `Context API` for theme/auth.
- **Validation:** Use `Zod` for API response and form validation.
- **Persistence:** Use `expo-secure-store` for sensitive tokens and `AsyncStorage` for non-sensitive UI state.

---

## 5. UI & Styling Standards

- **Styling:** Use `StyleSheet.create` for performance or Tailwind (via NativeWind) if configured.
- **Responsive Design:** Use `useWindowDimensions` and Flexbox. Avoid hardcoded pixel widths.
- **Safe Areas:** Wrap screen content in `SafeAreaView` from `react-native-safe-area-context`.
- **Theming:** Support system Light/Dark mode using `useColorScheme`.

---

## 6. Performance & Optimization

- **List Rendering:** Use `FlashList` for large lists; avoid mapping long lists inside `ScrollView`.
- **Images:** Use `expo-image` for caching and performance.
- **Memoization:** Use `useMemo`/`useCallback` for expensive values passed to children.
- **Bundle Size:** Prefer small, modern libs (e.g., `date-fns`, `Intl`) over large ones.

---

## 7. Security & API Best Practices

- **Secrets:** Never hardcode API keys. Use `process.env.EXPO_PUBLIC_*` or `expo-constants`.
- **Transport:** Require `https` for all external calls.
- **Input:** Sanitize and validate all external input using Zod schemas.
- **Error Handling:** Use Error Boundaries for major route groups.

---

## 8. Build & Deployment (EAS)

- **Primary Tools:** `EAS Build` and `EAS Update` are the main deployment paths.
- **Versioning:** Use `autoIncrement: true` in `eas.json` for CI-managed increments.
- **Profiles:** Distinguish `development`, `preview`, and `production` EAS profiles.

---

## 9. AI Agent Behavior Guidelines

- Prefer managed `expo-*` solutions before suggesting custom native modules.
- If recommending a non-Expo library, briefly justify the choice.
- Provide JSDoc for complex logic and clear step-by-step implementation guidance.

---

## 10. File & Folder Structure

- `app/` — File-based routes (Expo Router)
- `components/` — Reusable UI elements
- `hooks/` — Shared logic hooks
- `constants/` — Theme, API URLs, and static data
- `services/` — API clients and external integrations
- `assets/` — Images, fonts, and local files

---

## Expo Skills — Aggregated Plugin Guidance

This section summarizes the official `expo/skills` plugins so Copilot/agents can provide domain-specific guidance.

### expo-app-design

What this plugin covers:
- UI guidelines following Apple Human Interface Guidelines
- Expo Router navigation patterns (stacks, tabs, modals, sheets)
- Native iOS controls, SF Symbols, animations, and visual effects
- API route creation with EAS Hosting
- Data fetching patterns with React Query and offline support
- Tailwind CSS v4 setup for React Native via NativeWind v5
- DOM components for running web code in native apps

When to use:
- Building new Expo apps from scratch
- Adding navigation, styling, or animations
- Setting up API routes or data fetching
- Integrating web libraries via DOM components
- Configuring Tailwind CSS for React Native

Skills: `building-native-ui`, `expo-api-routes`, `native-data-fetching`, `expo-dev-client`, `expo-tailwind-setup`, `use-dom`

### expo-deployment

What this plugin covers:
- iOS App Store and TestFlight submissions
- Android Play Store deployment and track management
- EAS Build configuration and version management
- Writing and validating EAS Workflow YAML files for CI/CD
- Web deployment with EAS Hosting

When to use:
- Submitting apps to App Store Connect or Google Play
- Setting up TestFlight beta testing
- Configuring EAS Build profiles
- Writing CI/CD workflows for automated deployments
- Deploying web apps with EAS Hosting

Skills: `deployment`, `cicd-workflows`

### upgrading-expo

What this plugin covers:
- Step-by-step Expo SDK upgrade process and commands
- Identifying deprecated packages and modern replacements
- Cleaning and updating configuration files (babel, metro, postcss)
- Cache clearing for both managed and bare workflows
- Handling breaking changes between SDK versions

When to use:
- Upgrading to a new Expo SDK version
- Fixing dependency conflicts after an upgrade
- Migrating from deprecated packages (e.g., expo-av → expo-audio/expo-video)
- Cleaning up legacy configuration files

Skills: `upgrade-guides`

---

## How agents should use this file

- Prefer managed Expo solutions and official `expo-*` libraries when possible.
- Use `expo-app-design` guidance for UI and Tailwind setup.
- Use `expo-deployment` guidance for EAS Build, EAS Hosting, and store submissions.
- Use `upgrading-expo` guidance for SDK upgrade steps and migrations.

---
```
