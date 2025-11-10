import { View, Text, ScrollView, useColorScheme } from 'react-native';

export function DebugScreen() {
  const colorScheme = useColorScheme();

  const debugInfo = [
    {
      icon: '🎨',
      label: 'Current Theme',
      value:
        colorScheme === 'dark'
          ? 'Dark Mode'
          : colorScheme === 'light'
            ? 'Light Mode'
            : 'System Default',
      color: 'blue',
    },
    {
      icon: '💾',
      label: 'Color Scheme Value',
      value: colorScheme === null ? 'null' : `"${colorScheme}"`,
      color: 'purple',
    },
    {
      icon: '✓',
      label: 'Theme Detection',
      value: 'Active',
      color: 'green',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="px-6 py-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 dark:text-white">Debug Info</Text>
          <Text className="mt-2 text-base text-gray-600 dark:text-gray-300">
            System information and configuration details
          </Text>
        </View>

        {/* Status Banner */}
        <View className="mb-8 rounded-2xl bg-green-50 p-6 dark:bg-green-950/30">
          <View className="flex-row items-center">
            <Text className="text-3xl">✅</Text>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-green-900 dark:text-green-100">
                All Systems Operational
              </Text>
              <Text className="mt-1 text-sm text-green-800 dark:text-green-200">
                App is running smoothly with real-time theme detection
              </Text>
            </View>
          </View>
        </View>

        {/* Debug Cards Grid */}
        {debugInfo.map((item, index) => (
          <View
            key={index}
            className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
            <View className="border-l-4 border-blue-500 p-5">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-2xl">{item.icon}</Text>
                    <Text className="ml-3 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {item.label}
                    </Text>
                  </View>
                  <Text className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* System Instructions */}
        <View className="mb-8 rounded-2xl bg-blue-50 p-6 dark:bg-blue-950/30">
          <View className="flex-row">
            <Text className="text-2xl">💡</Text>
            <View className="ml-4 flex-1">
              <Text className="font-bold text-blue-900 dark:text-blue-100">Testing Theme</Text>
              <Text className="mt-2 text-sm leading-5 text-blue-800 dark:text-blue-200">
                Change your system appearance to see real-time theme updates:
              </Text>
              <View className="mt-3 space-y-1">
                <Text className="font-mono text-xs text-blue-700 dark:text-blue-300">
                  iOS: Settings → Display & Brightness
                </Text>
                <Text className="font-mono text-xs text-blue-700 dark:text-blue-300">
                  Android: Settings → Display → Dark Theme
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Technical Details */}
        <View className="mb-24 rounded-2xl bg-gray-100 p-6 dark:bg-gray-800">
          <Text className="font-bold text-gray-900 dark:text-white">Technical Details</Text>
          <View className="mt-4 space-y-2">
            <View className="flex-row justify-between rounded-lg bg-white p-3 dark:bg-gray-700">
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Framework
              </Text>
              <Text className="font-mono text-xs text-gray-900 dark:text-white">React Native</Text>
            </View>
            <View className="flex-row justify-between rounded-lg bg-white p-3 dark:bg-gray-700">
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">Styling</Text>
              <Text className="font-mono text-xs text-gray-900 dark:text-white">NativeWind</Text>
            </View>
            <View className="flex-row justify-between rounded-lg bg-white p-3 dark:bg-gray-700">
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Color Scheme
              </Text>
              <Text className="font-mono text-xs text-gray-900 dark:text-white">
                {colorScheme || 'system'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
