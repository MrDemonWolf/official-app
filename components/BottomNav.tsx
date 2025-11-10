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
  ];

  return (
    <View className="flex-row items-center justify-around border-t border-gray-200 bg-white px-2 pt-2 pb-4 shadow-lg">
      {tabs.map((tab, index) => {
        const isFocused = activeTab === index;
        const tabIcon = tabIcons[index];

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => setActiveTab(index)}
            className="flex-1 items-center justify-center py-3"
            activeOpacity={0.7}>
            <Text className={`mb-1 text-2xl ${isFocused ? 'opacity-100' : 'opacity-40'}`}>
              {tabIcon.icon}
            </Text>
            <Text
              className={`text-xs font-medium ${isFocused ? 'text-blue-600' : 'text-gray-500'}`}>
              {tabIcon.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
