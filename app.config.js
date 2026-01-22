const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  expo: {
    name: IS_DEV ? "MrDemonWolf (Dev)" : "MrDemonWolf",
    slug: "mrdemonwolf",
    version: "1.0.0",
    scheme: "mrdemonwolf",
    jsEngine: "hermes",
    newArchEnabled: true,
    runtimeVersion: {
      policy: "appVersion",
    },
    userInterfaceStyle: "automatic",
    backgroundColor: "#FFFFFF",
    icon: "./assets/images/icon.png",
    ios: {
      icon: "./assets/mrdemonwolf-ios.icon",
      bundleIdentifier: "com.mrdemonwolf.OfficialApp",
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
      package: "com.mrdemonwolf.OfficialApp",
      softwareKeyboardLayoutMode: "resize",
      // adaptiveIcon: {
      //   backgroundColor: "#E6F4FE",
      //   foregroundImage: "./assets/images/android-icon-foreground.png",
      // },
      permissions: ["INTERNET"],
    },
    extra: {
      eas: {
        projectId: "4a220b17-d746-48f1-9f46-d83a0a933b40",
      },
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
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
