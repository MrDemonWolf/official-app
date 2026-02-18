import { ConfigContext, ExpoConfig } from "expo/config";

const APP_VARIANT = process.env.APP_VARIANT || "development";
const IS_PRODUCTION = APP_VARIANT === "production";

const getBundleId = () => {
  return IS_PRODUCTION
    ? "com.mrdemonwolf.OfficialApp"
    : "com.mrdemonwolf.OfficialApp.dev";
};

const getIcon = () => {
  return "./src/assets/images/icon.png";
};

const getAndroidForegroundIcon = () => {
  return "./src/assets/images/android-icon-foreground.png";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: "mrdemonwolf-org",
  name: IS_PRODUCTION ? "MrDemonWolf" : "MDW (Dev)",
  slug: "official-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: getIcon(),
  scheme: "mrdemonwolf",
  userInterfaceStyle: "automatic",
  updates: {
    url: "https://u.expo.dev/4a220b17-d746-48f1-9f46-d83a0a933b40",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getBundleId(),
    buildNumber: "2",
    googleServicesFile: "./GoogleService-Info.plist",
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      NSMotionUsageDescription:
        "This app uses haptic feedback to enhance your experience.",
      UIBackgroundModes: [],
    },
  },
  android: {
    package: getBundleId(),
    versionCode: 2,
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: getAndroidForegroundIcon(),
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
    "expo-sqlite",
    "expo-web-browser",
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
    "@react-native-firebase/app",
    "@react-native-firebase/app-check",
  ],
  extra: {
    eas: {
      projectId: "4a220b17-d746-48f1-9f46-d83a0a933b40",
    },
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
