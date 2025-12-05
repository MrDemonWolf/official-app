import { ScrollView, Text, useColorScheme, View } from "react-native";
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl font-bold text-center dark:text-white">
            Android Contact - Under Construction
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
