import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationTab } from '../../types';
import { NAV_TABS } from '../../constants';

interface BottomNavProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  tabs: NavigationTab[];
}

export function BottomNav({ activeTab, setActiveTab, tabs }: BottomNavProps) {
  return (
    <View className="absolute right-0 bottom-0 left-0 w-full flex-row items-center justify-around border-t border-gray-200 bg-white px-4 py-2 shadow-lg dark:border-gray-800 dark:bg-gray-950">
      {tabs.map((tab, index) => {
        const isFocused = activeTab === index;
        const tabConfig = NAV_TABS[index];

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => setActiveTab(index)}
            className="flex-1 items-center justify-center py-2"
            activeOpacity={0.6}>
            <Text className={`text-2xl ${isFocused ? 'opacity-100' : 'opacity-40'}`}>
              {tabConfig.icon}
            </Text>
            <Text
              className={`mt-1 text-xs font-medium ${isFocused ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>
              {tabConfig.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
