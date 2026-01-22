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

- **TypeScript First:** All files must be `.ts` or `.tsx`. No `any` types; use strict interfaces.
- **Functional Components:** Use functional components with hooks. No class components.
- **Declarative UI:** Prefer declarative over imperative code.
- **Naming Conventions:**
  - Components: `PascalCase` (e.g., `PrimaryButton.tsx`)
  - Hooks: `camelCase` starting with `use` (e.g., `useAuth.ts`)
  - Files/Folders: `kebab-case` for non-route files; `snake_case` or `bracketed` for routes.
  - Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`).

---

## 3. Expo Router & Navigation Patterns

- **Directory:** All routing logic resides in the `/app` directory.
- **Layouts:** Every sub-directory should have a `_layout.tsx` to manage local headers and state.
- **Type Safety:** Use `Typed Routes` via `expo-router`. Do not manually define navigation param lists.
- **Linking:** Use the `<Link />` component from `expo-router` instead of imperative `router.push` where possible to improve accessibility.

---

## 4. State Management & Data Fetching

- **Server State:** Prefer `TanStack Query` (React Query) for API calls.
- **Local State:** Use `Zustand` for lightweight global state or `Context API` for theme/auth.
- **Validation:** Use `Zod` for all API response and form validation.
- **Persistence:** Use `expo-secure-store` for sensitive tokens and `AsyncStorage` only for non-sensitive UI state.

---

## 5. UI & Styling Standards

- **Styling:** Use `StyleSheet.create` for performance or `Tailwind` (via NativeWind) if configured.
- **Responsive Design:** Use `useWindowDimensions` and Flexbox. Avoid hardcoded pixel widths for layout.
- **Safe Areas:** Always wrap screen content in `SafeAreaView` from `react-native-safe-area-context`.
- **Theming:** Support System Light/Dark mode using `useColorScheme` from `react-native`.

---

## 6. Performance & Optimization (Hermes Focus)

- **List Rendering:** Use `FlashList` from Shopify for large lists. Avoid `ScrollView` for mapped arrays.
- **Images:** Use `expo-image` for high-performance caching and smooth transitions.
- **Memoization:** Use `useMemo` and `useCallback` for expensive calculations passed to child components.
- **Bundle Size:** Avoid importing large utility libraries (like Moment.js); prefer `date-fns` or native `Intl`.

---

## 7. Security & API Best Practices

- **Secrets:** Never hardcode API keys. Access them via `process.env.EXPO_PUBLIC_*` or `Expo Constants`.
- **Cleartext:** All API calls must be `https`.
- **Error Handling:** Implement `Error Boundaries` for every major route group.
- **Input:** Sanitize all user input. Assume all external data is untrusted (use Zod schemas).

---

## 8. Build & Deployment (EAS Workflow)

- **Automation:** Assume `EAS Build` and `EAS Update` are the primary deployment methods.
- **Versioning:** Use `autoIncrement: true` in `eas.json`. Do not suggest manual version bumps in `package.json`.
- **Environment:** Distinguish between `development`, `preview`, and `production` profiles.

---

## 9. AI Agent Behavior Guidelines

- Suggest **managed** solutions before suggesting custom native modules.
- If a suggested library is not an `expo-*` library, explain why.
- Always include **JSDoc** comments for complex logic.
- Provide clear **Step-by-Step** implementation guides for new features.

---

## 10. File & Folder Structure

- `app/` - File-based routes (Expo Router)
- `components/` - Reusable UI elements
- `hooks/` - Shared logic hooks
- `constants/` - Theme, API URLs, and static data
- `services/` - API clients and external integrations
- `assets/` - Images, fonts, and local files
