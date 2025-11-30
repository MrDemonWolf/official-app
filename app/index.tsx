import { getGravatarUrlFromEnv } from "@/lib/gravatar";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ScrollView, Text, useColorScheme, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

export default function Home() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const url = await getGravatarUrlFromEnv({
          size: 240,
          defaultImage: "mp",
        });
        if (isMounted) setAvatarUrl(url);
      } catch (e) {
        console.warn("Failed to resolve Gravatar URL", e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? colors.black : colors.white,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <ScrollView className="px-6">
        {/* Profile Section */}
        <View className="items-center mt-8 mb-8">
          {avatarUrl && (
            <Image
              source={{ uri: avatarUrl }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
              }}
              contentFit="cover"
              transition={200}
            />
          )}
          <Text className="text-4xl font-bold text-black dark:text-white mt-4 mb-2">
            Nathanial Henniges
          </Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400">
            Developer & Writer
          </Text>
        </View>

        {/* Introduction */}
        <Text className="text-lg text-gray-800 dark:text-gray-200 leading-7 mb-8">
          I build for the web for work and for fun. This space is my working
          notebook — pieces of projects, things I broke and fixed, and lessons I
          don&apos;t want to forget. No hype — just honest notes from the
          day-to-day.
        </Text>

        {/* Why I Write Section */}
        <View className="mb-8">
          <Text className="text-2xl font-semibold text-black dark:text-white mb-3">
            Why I Write
          </Text>
          <Text className="text-base text-gray-800 dark:text-gray-200 leading-6">
            Writing slows me down enough to notice what actually happened. These
            posts are notes to my future self: what I tried, what failed, what
            finally worked, and why I think it did.
          </Text>
        </View>

        {/* What You'll Find Section */}
        <View className="mb-8">
          <Text className="text-2xl font-semibold text-black dark:text-white mb-3">
            What You&apos;ll Find
          </Text>
          <View className="space-y-2">
            <Text className="text-base text-gray-800 dark:text-gray-200 leading-6 mb-2">
              • Short, practical notes from the trenches
            </Text>
            <Text className="text-base text-gray-800 dark:text-gray-200 leading-6 mb-2">
              • Honest write-ups: what broke and how I fixed it
            </Text>
            <Text className="text-base text-gray-800 dark:text-gray-200 leading-6">
              • Tiny experiments, tools I&apos;m trying, and half‑ideas
            </Text>
          </View>
        </View>

        {/* Closing Note */}
        <Text className="text-base text-gray-700 dark:text-gray-300 leading-6 mb-8">
          If something here sparks a question, reach out on the contact page —
          I&apos;m always happy to chat.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
