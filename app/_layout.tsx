import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Linking from "expo-linking";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { StatusBar } from "expo-status-bar";

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
        backgroundColor={colorScheme === "dark" ? "#050505" : "#F6F6F8"}
        iconColor={{
          default: colorScheme === "dark" ? "#636366" : "#5F6368",
          selected: colorScheme === "dark" ? "#0A84FF" : "#007AFF",
        }}
        labelStyle={{
          default: {
            fontSize: 12,
          },
          selected: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <NativeTabs.Trigger name="index">
          <Icon
            sf={{ default: "house", selected: "house.fill" }}
            drawable="ic_tab_home"
          />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="blog">
          <Icon
            sf={{ default: "book", selected: "book.fill" }}
            drawable="ic_tab_blog"
          />
          <Label>Blog</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="portfolio">
          <Icon
            sf={{ default: "briefcase", selected: "briefcase.fill" }}
            drawable="ic_tab_portfolio"
          />
          <Label>Portfolio</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="contact">
          <Icon
            sf={{ default: "envelope", selected: "envelope.fill" }}
            drawable="ic_tab_contact"
          />
          <Label>Contact</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
      <StatusBar style="auto" translucent={true} />
    </ThemeProvider>
  );
});
