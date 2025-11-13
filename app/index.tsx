import { ScrollView, Text } from "react-native";

export default function Home() {
  const numberOfLines = 50; // Adjust this number to create more or fewer lines
  const renderTextLines = () => {
    const lines = [];
    for (let i = 0; i < numberOfLines; i++) {
      lines.push(
        <Text className="text-black dark:text-white text-8xl" key={i}>
          This is line {i + 1}
        </Text>
      );
    }
    return lines;
  };
  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      {renderTextLines()}
    </ScrollView>
  );
}
