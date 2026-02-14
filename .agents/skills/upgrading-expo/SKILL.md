---
name: upgrading-expo
description: Guidelines for upgrading Expo SDK versions and fixing dependency issues
version: 1.0.0
license: MIT
---

## References

- ./references/new-architecture.md -- SDK +53: New Architecture migration guide
- ./references/react-19.md -- SDK +54: React 19 changes (useContext → use, Context.Provider → Context, forwardRef removal)
- ./references/react-compiler.md -- SDK +54: React Compiler setup and migration guide
- ./references/native-tabs.md -- SDK +55: Native tabs changes (Icon/Label/Badge now accessed via NativeTabs.Trigger.\*)
- ./references/expo-av-to-audio.md -- Migrate audio playback and recording from expo-av to expo-audio
- ./references/expo-av-to-video.md -- Migrate video playback from expo-av to expo-video

## Beta/Preview Releases

Beta versions use `.preview` suffix (e.g., `55.0.0-preview.2`), published under `@next` tag.

Check if latest is beta: https://exp.host/--/api/v2/versions (look for `-preview` in `expoVersion`)

```bash
npx expo install expo@next --fix  # install beta
```

## Step-by-Step Upgrade Process

1. Upgrade Expo and dependencies

```bash
npx expo install expo@latest
npx expo install --fix
```

2. Run diagnostics: `npx expo-doctor`

3. Clear caches and reinstall

```bash
npx expo export -p ios --clear
rm -rf node_modules .expo
watchman watch-del-all
```

## Breaking Changes Checklist

- Check for removed APIs in release notes
- Update import paths for moved modules
- Review native module changes requiring prebuild
- Test all camera, audio, and video features
- Verify navigation still works correctly

## Prebuild for Native Changes

If upgrading requires native changes:

```bash
npx expo prebuild --clean
```

This regenerates the `ios` and `android` directories. Ensure the project is not a bare workflow app before running this command.

## Clear caches for bare workflow

- Clear the cocoapods cache for iOS: `cd ios && pod install --repo-update`
- Clear derived data for Xcode: `npx expo run:ios --no-build-cache`
- Clear the Gradle cache for Android: `cd android && ./gradlew clean`

## Housekeeping

- Review release notes for the target SDK version at https://expo.dev/changelog
- If using Expo SDK 54 or later, ensure react-native-worklets is installed — this is required for react-native-reanimated to work.
- Enable React Compiler in SDK 54+ by adding `"experiments": { "reactCompiler": true }` to app.json — it's stable and recommended
- Delete sdkVersion from `app.json` to let Expo manage it automatically
- Remove implicit packages from `package.json`: `@babel/core`, `babel-preset-expo`, `expo-constants`.
- If the babel.config.js only contains 'babel-preset-expo', delete the file
- If the metro.config.js only contains expo defaults, delete the file

## Deprecated Packages

| Old Package               | Replacement                                          |
| ------------------------- | ---------------------------------------------------- |
| `expo-av`                 | `expo-audio` and `expo-video`                        |
| `expo-permissions`        | Individual package permission APIs                   |
| `@expo/vector-icons`      | `expo-image` with `source="sf:name"` for SF Symbols  |
| `AsyncStorage`            | `expo-sqlite/localStorage/install`                   |
| `expo-app-loading`        | `expo-splash-screen`                                 |
| `expo-linear-gradient`    | experimental_backgroundImage + CSS gradients in View |
| `expo-video-thumbnails`   | `generateThumbnailsAsync` from `expo-video`          |
| `@react-navigation/bottom-tabs` | `NativeTabs` from `expo-router/unstable-native-tabs` |
| `Platform.OS`             | `process.env.EXPO_OS` (tree-shakeable)               |
| `useContext`              | `use()` from React 19                                |
| `Context.Provider`        | `<Context>` directly (React 19)                      |

When migrating deprecated packages, update all code usage before removing the old package. For expo-av, consult the migration references to convert Audio.Sound to useAudioPlayer, Audio.Recording to useAudioRecorder, and Video components to VideoView with useVideoPlayer.

## expo.install.exclude

Check if package.json has excluded packages:

```json
{
  "expo": { "install": { "exclude": ["react-native-reanimated"] } }
}
```

Exclusions are often workarounds that may no longer be needed after upgrading. Review each one.
## Removing patches

Check if there are any outdated patches in the `patches/` directory. Remove them if they are no longer needed.

## Postcss

- `autoprefixer` isn't needed in SDK +53. Remove it from dependencies and check `postcss.config.js` or `postcss.config.mjs` to remove it from the plugins list.
- Use `postcss.config.mjs` in SDK +53.

## Metro

Remove redundant metro config options:

- resolver.unstable_enablePackageExports is enabled by default in SDK +53.
- `experimentalImportSupport` is enabled by default in SDK +54.
- `EXPO_USE_FAST_RESOLVER=1` is removed in SDK +54.
- cjs and mjs extensions are supported by default in SDK +50.
- Expo webpack is deprecated, migrate to [Expo Router and Metro web](https://docs.expo.dev/router/migrate/from-expo-webpack/).

## New Architecture

The new architecture is enabled by default, the app.json field `"newArchEnabled": true` is no longer needed as it's the default. Expo Go only supports the new architecture as of SDK +53.

## SDK 55 Specific Changes

### Breaking Changes
- **Legacy Architecture removed**: SDK 55 no longer supports Legacy Architecture at all. The `newArchEnabled` config option is eliminated.
- **`notification` field removed from app.json**: Migrate to the `expo-notifications` config plugin instead.
- **`expo-av` removed from Expo Go**: Use `expo-audio` and `expo-video` instead.
- **`headerBlurEffect` conflicts with `scrollEdgeEffects`**: In SDK 55, `react-native-screens` handles scroll edge blur effects automatically. Remove `headerBlurEffect` from Stack screenOptions to avoid the warning: "Using both blurEffect and scrollEdgeEffects simultaneously may cause overlapping effects."
- **`Appearance.setColorScheme(null)` → `'unspecified'`**: React Native 0.83 changed `ColorSchemeName` type to `'light' | 'dark' | 'unspecified'` (no longer accepts `null`).
- **`edgeToEdgeEnabled` removed**: This property no longer exists in the Android config type.
- **NativeTabs import changes**: `Icon`, `Label`, `Badge` are no longer separate exports. Use `NativeTabs.Trigger.Icon`, `NativeTabs.Trigger.Label`, `NativeTabs.Trigger.Badge` instead.
- **expo-blur API change**: Android now uses RenderNode API (Android 12+). Requires wrapping blurrable content in `<BlurTargetView>`.
- **expo-video-thumbnails deprecated**: Use `generateThumbnailsAsync` from `expo-video` instead. Will be removed in SDK 56.
- **`removeSubscription` deprecated**: Use `subscription.remove()` method returned from event listeners.

### New Features
- **React Native 0.83.1** and **React 19.2.0**
- **Hermes v1 opt-in**: Available via `useHermesV1` in `expo-build-properties`
- **Stack.Toolbar API**: Native iOS toolbar buttons (replaces custom headerRight Pressable patterns)
- **Stack.SearchBar component**: Replaces `headerSearchBarOptions` for cleaner search bar integration
- **Expo Router Colors API**: Dynamic Material 3 styles for Android, adaptive colors for iOS
- **Apple Zoom Transition**: Interactive shared element transitions (iOS, enabled by default)
- **SDK package versioning**: All Expo SDK packages now use same major version as SDK (e.g., `expo-camera@^55.0.0`)
- **NativeTabs.Trigger.Icon `md` prop**: Material icons for Android (replaces `drawable` prop)

### Stack screenOptions for SDK 55
Remove these from Stack screenOptions — they are now handled automatically:
```tsx
// Remove these — SDK 55 handles them natively
headerBlurEffect: 'systemUltraThinMaterial',  // causes conflict with scrollEdgeEffects
```

Keep these — still needed:
```tsx
headerTransparent: true,
headerLargeTitle: true,
headerLargeStyle: { backgroundColor: 'transparent' },
headerShadowVisible: false,
headerLargeTitleShadowVisible: false,
headerBackButtonDisplayMode: 'minimal',
```
