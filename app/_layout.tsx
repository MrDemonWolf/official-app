import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { BlurView } from "expo-blur";
import * as Linking from "expo-linking";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { StatusBar } from "expo-status-bar";
import { DynamicColorIOS, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as Sentry from "@sentry/react-native";
import "react-native-reanimated";

Sentry.init({
  dsn: "https://332056eee148326785189286ec6d77a2@o4508281688752128.ingest.us.sentry.io/4510419880640512",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  integrations: [Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();
  const safeAreaInsets = useSafeAreaInsets();

  const url = Linking.useLinkingURL();

  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`
    );
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativeTabs
        blurEffect="systemUltraThinMaterial"
        iconColor={{
          default: DynamicColorIOS({
            light: "#8E8E93",
            dark: "#636366",
          }),
          selected: DynamicColorIOS({
            light: "#007AFF",
            dark: "#0A84FF",
          }),
        }}
      >
        <NativeTabs.Trigger name="index">
          <Icon sf="house.fill" drawable="custom_android_drawable" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="blog">
          <Icon sf="book.fill" drawable="custom_book_drawable" />
          <Label>Blog</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="portfolio">
          <Icon sf="briefcase.fill" drawable="custom_briefcase_drawable" />
          <Label>Portfolio</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="contact">
          <Icon sf="envelope.fill" drawable="custom_envelope_drawable" />
          <Label>Contact</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: safeAreaInsets.top,
        }}
      >
        <BlurView
          intensity={10}
          tint={colorScheme === "dark" ? "dark" : "light"}
          style={{ flex: 1 }}
        />
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
});
