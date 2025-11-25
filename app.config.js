// Expo app config using EAS environment variables
const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.mrdemonwolf.OfficialApp.dev";
  }
  if (IS_PREVIEW) {
    return "com.mrdemonwolf.OfficialApp.preview";
  }
  return "com.mrdemonwolf.OfficialApp";
};

const getAppName = () => {
  if (IS_DEV) {
    return "MrDemonWolf (Dev)";
  }
  if (IS_PREVIEW) {
    return "MrDemonWolf (Preview)";
  }
  return "MrDemonWolf";
};

export default {
  name: getAppName(),
  slug: "mrdemonwolf",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "mrdemonwolf",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    icon: "./assets/mrdemonwolf-ios.icon",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    intentFilters: [
      {
        action: "VIEW",
        data: [
          {
            scheme: "mrdemonwolf",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
    package: getUniqueIdentifier(),
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
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        project: "officialapp",
        organization: "mrdemonwolf",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      appVariant: process.env.APP_VARIANT,
      projectId: "e10e7345-9182-468c-beb1-f7c15c2c813e",
    },
  },
  owner: "mrdemonwolf-org",
};
