import { ScrollView, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

export default function Portfolio() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? colors.black : colors.white,
      }}
    >
      <ScrollView className="flex-1 p-4">
        {/* Your blog content goes here */}
      </ScrollView>
    </SafeAreaView>
  );
}
