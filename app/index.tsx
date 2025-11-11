import { StyleSheet, Text, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function Tab() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Text>Tab</Text>
      <Text>{colorScheme === "dark" ? "Dark" : "Light"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
