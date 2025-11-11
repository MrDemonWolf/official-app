import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { StatusBar } from "expo-status-bar";
import { DynamicColorIOS } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativeTabs
        labelStyle={{
          // For the text color
          color: DynamicColorIOS({
            dark: "white",
            light: "black",
          }),
        }}
        // For the selected icon color
        tintColor={DynamicColorIOS({
          dark: "white",
          light: "black",
        })}
      >
        <NativeTabs.Trigger name="index">
          <Label>Home</Label>
          <Icon sf="house.fill" drawable="custom_android_drawable" />
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
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
