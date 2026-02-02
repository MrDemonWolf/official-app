import { ExpoConfig, ConfigContext } from "expo/config";

// 1. Identify the Environment
const IS_DEV = process.env.APP_VARIANT === "development";

// 2. Helper Functions to switch values
const getUniqueIdentifier = () => {
  if (IS_DEV) return 'com.mrdemonwolf.officialapp.dev';
  return 'com.mrdemonwolf.officialapp'; // Prod & TestFlight
};

const getAppName = () => {
  if (IS_DEV) return 'MDW Dev';
  return 'MrDemonWolf';
};

// 3. The Configuration Object
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: getAppName(),
    slug: 'official-app',
    version: '1.0.0',
    orientation: 'default',
    icon: './assets/images/icon.png',
    scheme: 'mrdemonwolf',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    assetBundlePatterns: ["**/*"],

    // Splash Screen
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
      dark: {
        image: './assets/images/splash-icon.png',
        backgroundColor: '#000000',
      },
    },

    // iOS Config
    ios: {
      supportsTablet: true,
      bundleIdentifier: getUniqueIdentifier(),
      buildNumber: '1',
      config: {
        usesNonExemptEncryption: false,
      },
    },

    // Android Config
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        backgroundColor: '#E6F4FE',
        monochromeImage: './assets/images/android-icon-monochrome.png'
      },
      package: getUniqueIdentifier(),
      versionCode: 1,
      permissions: [
        "INTERNET"
      ]
    },

    plugins: [
      "expo-router",
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/Montserrat-Regular.ttf",
            "./assets/fonts/Montserrat-Bold.ttf",
            "./assets/fonts/Roboto-Regular.ttf",
            "./assets/fonts/Roboto-Bold.ttf"
          ]
        }
      ],
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "image": "./assets/images/splash-icon.png",
            "backgroundColor": "#000000"
          }
        }
      ]
    ],

    extra: {
      variant: process.env.APP_VARIANT || 'production',
      wordpressApiUrl: process.env.EXPO_PUBLIC_WORDPRESS_API_URL || "https://mrdemonwolf.com/wp-json",
      eas: {
        projectId: "your-project-id-here"
      }
    },

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    }
  };
};
