import { ConfigContext, ExpoConfig } from "expo/config";

const APP_VARIANT = process.env.APP_VARIANT || "development";

const getAppName = () => {
  switch (APP_VARIANT) {
    case "production":
      return "MrDemonWolf";
    case "preview":
      return "MrDemonWolf (Preview)";
    default:
      return "MrDemonWolf (Dev)";
  }
};

const getBundleId = () => {
  switch (APP_VARIANT) {
    case "production":
      return "com.mrdemonwolf.OfficialApp";
    default:
      return "com.mrdemonwolf.OfficialApp.dev";
  }
};

const getIcon = () => {
  return "./assets/images/icon.png";
  // switch (APP_VARIANT) {
  //   case "production":
  //     return "./assets/images/icon.png";
  //   case "preview":
  //     return "./assets/images/icon-preview.png";
  //   default:
  //     return "./assets/images/icon-dev.png";
  // }
};

const getAndroidForegroundIcon = () => {
  return "./assets/images/android-icon-foreground.png";
  // switch (APP_VARIANT) {
  //   case "production":
  //     return "./assets/images/android-icon-foreground.png";
  //   case "preview":
  //     return "./assets/images/android-icon-foreground-preview.png";
  //   default:
  //     return "./assets/images/android-icon-foreground-dev.png";
  // }
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
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
  },
  android: {
    package: getBundleId(),
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: getAndroidForegroundIcon(),
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
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
