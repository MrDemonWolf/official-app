import { Text, useColorScheme, View } from "react-native";

export default function TabContact() {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colorScheme === "dark" ? "#0B1226" : "#FFFFFF",
      }}
    >
      <Text style={{ color: colorScheme === "dark" ? "#FFFFFF" : "#000000" }}>
        Contact Screen
      </Text>
    </View>
  );
}
