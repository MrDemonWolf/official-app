import { ConfigContext, ExpoConfig } from "expo/config";

const APP_VARIANT = process.env.APP_VARIANT || "development";
const IS_PRODUCTION = APP_VARIANT === "production";

const EAS_PROJECT_ID = "4a220b17-d746-48f1-9f46-d83a0a933b40";

const BUNDLE_ID = IS_PRODUCTION
  ? "com.mrdemonwolf.OfficialApp"
  : "com.mrdemonwolf.OfficialApp.dev";

const APP_NAME = IS_PRODUCTION ? "MrDemonWolf" : "MDW (Dev)";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: "mrdemonwolf-org",
  name: APP_NAME,
  slug: "official-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  scheme: "mrdemonwolf",
  userInterfaceStyle: "automatic",

  updates: {
    url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
  },

  runtimeVersion: {
    policy: "appVersion",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_ID,
    buildNumber: "2",
    googleServicesFile: "./GoogleService-Info.plist",
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      NSMotionUsageDescription:
        "This app uses haptic feedback to enhance your experience.",
      UIBackgroundModes: ["remote-notification"],
    },
  },

  android: {
    package: BUNDLE_ID,
    versionCode: 2,
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./src/assets/images/android-icon-foreground.png",
      backgroundImage: "./src/assets/images/android-icon-background.png",
      monochromeImage: "./src/assets/images/android-icon-monochrome.png",
    },
  },

  web: {
    output: "static",
    favicon: "./src/assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    "expo-font",
    "expo-image",
    "expo-sqlite",
    "expo-web-browser",
    "./src/plugins/modular-headers",
    [
      "expo-splash-screen",
      {
        image: "./src/assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./src/assets/images/icon.png",
        color: "#3b82f6",
      },
    ],
    "./src/plugins/notification-service-extension",
    "@react-native-firebase/app",
    "@react-native-firebase/app-check",
  ],

  extra: {
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
