import { ConfigContext, ExpoConfig } from "expo/config";

const APP_VARIANT = process.env.APP_VARIANT || "development";

const getBundleId = () => {
  switch (APP_VARIANT) {
    case "production":
      return "com.mrdemonwolf.OfficialApp";
    default:
      return "com.mrdemonwolf.OfficialApp.dev";
  }
};

const getIcon = () => {
  return "./src/assets/images/icon.png";
};

const getAndroidForegroundIcon = () => {
  return "./src/assets/images/android-icon-foreground.png";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "MrDemonWolf",
  slug: "official-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: getIcon(),
  scheme: "mrdemonwolf",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getBundleId(),
    buildNumber: "1",
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      NSMotionUsageDescription:
        "This app uses haptic feedback to enhance your experience.",
    },
  },
  android: {
    package: getBundleId(),
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: getAndroidForegroundIcon(),
      backgroundImage: "./src/assets/images/android-icon-background.png",
      monochromeImage: "./src/assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    output: "static",
    favicon: "./src/assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
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
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
