// CI/Build switch: set `APP_VARIANT=development` in CI to enable dev identifiers.
const IS_DEV = process.env.APP_VARIANT === "development";

// Minimal, production-oriented Expo configuration. Avoid embedding secrets here;
// expose runtime values via `extra` and `EXPO_PUBLIC_*` env vars.
export default {
  expo: {
    // App display name (append "(Dev)" for internal dev builds)
    name: IS_DEV ? "MrDemonWolf (Dev)" : "MrDemonWolf",
    slug: "official-app",
    version: "1.0.0",
    scheme: "mrdemonwolf",
    jsEngine: "hermes",
    newArchEnabled: true,
    runtimeVersion: { policy: "appVersion" },
    userInterfaceStyle: "automatic",
    backgroundColor: "#FFFFFF",
    icon: "./assets/images/icon.png",

    ios: {
      icon: "./assets/mrdemonwolf-ios.icon",
      // Use `.dev` suffix for CI/dev bundle IDs to keep prod IDs immutable.
      bundleIdentifier: IS_DEV
        ? "com.mrdemonwolf.OfficialApp.dev"
        : "com.mrdemonwolf.OfficialApp",
      supportsTablet: true,
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
          },
        ],
      },
    },

    android: {
      // Keep package names aligned with iOS for release management.
      package: IS_DEV
        ? "com.mrdemonwolf.OfficialApp.dev"
        : "com.mrdemonwolf.OfficialApp",
      softwareKeyboardLayoutMode: "resize",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
      },
      permissions: ["INTERNET"],
    },

    // Runtime extras (non-secret). Provide secrets via secure stores or CI.
    extra: {
      eas: {
        projectId: "4a220b17-d746-48f1-9f46-d83a0a933b40",
      },
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
    },

    // Plugins required by this project. Keep versions/config managed in CI.
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/images/splash-icon.png",
            backgroundColor: "#0B1226",
          },
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            kotlinVersion: "2.2.20",
          },
          ios: {
            deploymentTarget: "18.0",
          },
        },
      ],
    ],
    owner: "mrdemonwolf-org",
  },
};
