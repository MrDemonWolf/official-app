import { View, Text, ScrollView } from 'react-native';

export function PortfolioScreen() {
  return (
    <ScrollView className="flex-1 bg-white pt-4">
      <View className="px-6 py-4">
        <Text className="text-3xl font-bold text-gray-900 mb-4">Portfolio</Text>
        
        <View className="bg-gray-100 rounded-lg p-4 mb-4">
          <Text className="text-xl font-semibold text-gray-800">My Projects</Text>
          <Text className="text-gray-600 mt-2">Check out my recent work and projects.</Text>
        </View>

        <View className="bg-green-50 rounded-lg p-4 mb-4">
          <Text className="font-semibold text-green-900">Project 1: E-Commerce App</Text>
          <Text className="text-gray-700 mt-2 text-sm">React Native • Firebase • Stripe</Text>
        </View>

        <View className="bg-green-50 rounded-lg p-4 mb-4">
          <Text className="font-semibold text-green-900">Project 2: Social Media Platform</Text>
          <Text className="text-gray-700 mt-2 text-sm">React Native • Node.js • PostgreSQL</Text>
        </View>

        <View className="bg-green-50 rounded-lg p-4 mb-24">
          <Text className="font-semibold text-green-900">Project 3: Fitness Tracker</Text>
          <Text className="text-gray-700 mt-2 text-sm">React Native • Expo • Cloud Storage</Text>
        </View>
      </View>
    </ScrollView>
  );
}
