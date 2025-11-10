import { View, Text, TouchableOpacity } from 'react-native';

interface BottomNavProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  tabs: { name: string; component: any }[];
}

export function BottomNav({ activeTab, setActiveTab, tabs }: BottomNavProps) {
  const tabIcons = [
    { icon: '📝', label: 'Blog' },
    { icon: '💼', label: 'Portfolio' },
    { icon: '✉️', label: 'Contact' },
    { icon: '🐛', label: 'Debug' },
  ];

  return (
    <View className="flex-row items-center justify-around border-t border-gray-200 bg-white px-2 pt-2 pb-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      {tabs.map((tab, index) => {
        const isFocused = activeTab === index;
        const tabIcon = tabIcons[index];

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => setActiveTab(index)}
            className={`flex-1 items-center justify-center rounded-lg py-3 ${isFocused ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
            activeOpacity={0.7}>
            <Text className={`mb-1 text-2xl ${isFocused ? 'opacity-100' : 'opacity-50'}`}>
              {tabIcon.icon}
            </Text>
            <Text
              className={`text-xs font-medium ${isFocused ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {tabIcon.label}
            </Text>
            {isFocused && (
              <View className="mt-1 h-1 w-6 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
