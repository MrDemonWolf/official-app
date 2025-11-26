import { ScrollView, Text, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

export default function Home() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? colors.black : colors.white,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Text className="text-3xl font-bold text-black dark:text-white mb-4">
        About me
      </Text>

      <Text className="text-xl text-gray-800 dark:text-gray-200 mb-4">
        Hi — I&apos;m Nathanial Henniges. I build websites and tinker with
        WordPress and web tooling. This site and the writing here are a place
        for me to record what I&apos;m learning and to share honest notes about
        projects, mistakes, and experiments.
      </Text>

      <Text className="text-lg font-semibold text-black dark:text-white mb-2">
        Why I write
      </Text>
      <Text className="text-xl text-gray-800 dark:text-gray-200 mb-4">
        I blog because writing helps me think clearly. This isn&apos;t marketing
        copy — it&apos;s a small, personal log of things I tried, what worked,
        what didn&apos;t, and the ideas I&apos;m exploring next. If something
        here helps you, that&apos;s great; if it doesn&apos;t, that&apos;s fine
        too — I write primarily for my own learning.
      </Text>

      <Text className="text-lg font-semibold text-black dark:text-white mb-2">
        What you&apos;ll find here
      </Text>
      <Text className="text-base text-gray-800 dark:text-gray-200 mb-2">
        • Practical notes and short tutorials
      </Text>
      <Text className="text-base text-gray-800 dark:text-gray-200 mb-2">
        • Postmortems and honest project write-ups
      </Text>
      <Text className="text-base text-gray-800 dark:text-gray-200 mb-4">
        • Small experiments and ideas I&apos;m exploring
      </Text>

      <Text className="text-base text-gray-800 dark:text-gray-200">
        If you&apos;d like to connect or ask something specific, head to the
        contact page. Thanks for stopping by — I hope a few of these notes are
        useful on your own journey.
      </Text>
    </ScrollView>
  );
}
