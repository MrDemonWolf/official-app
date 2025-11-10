import { View, Text, ScrollView } from 'react-native';

export function PortfolioScreen() {
  return (
    <ScrollView className="flex-1 bg-white pt-4">
      <View className="px-6 py-4">
        <Text className="mb-4 text-3xl font-bold text-gray-900">Portfolio</Text>

        <View className="mb-4 rounded-lg bg-gray-100 p-4">
          <Text className="text-xl font-semibold text-gray-800">My Projects</Text>
          <Text className="mt-2 text-gray-600">Check out my recent work and projects.</Text>
        </View>

        <View className="mb-4 rounded-lg bg-green-50 p-4">
          <Text className="font-semibold text-green-900">Project 1: E-Commerce App</Text>
          <Text className="mt-2 text-sm text-gray-700">React Native • Firebase • Stripe</Text>
        </View>

        <View className="mb-4 rounded-lg bg-green-50 p-4">
          <Text className="font-semibold text-green-900">Project 2: Social Media Platform</Text>
          <Text className="mt-2 text-sm text-gray-700">React Native • Node.js • PostgreSQL</Text>
        </View>

        <View className="mb-24 rounded-lg bg-green-50 p-4">
          <Text className="font-semibold text-green-900">Project 3: Fitness Tracker</Text>
          <Text className="mt-2 text-sm text-gray-700">React Native • Expo • Cloud Storage</Text>
        </View>
      </View>
    </ScrollView>
  );
}
