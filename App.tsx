import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';

import './global.css';
import { BlogScreen } from 'components/screens/BlogScreen';
import { PortfolioScreen } from 'components/screens/PortfolioScreen';
import { ContactScreen } from 'components/screens/ContactScreen';
import { DebugScreen } from 'components/screens/DebugScreen';
import { BottomNav } from 'components/BottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Blog', component: BlogScreen },
    { name: 'Portfolio', component: PortfolioScreen },
    { name: 'Contact', component: ContactScreen },
    { name: 'Debug', component: DebugScreen },
  ];

  const CurrentPage = tabs[activeTab].component;

  // The dark: classes automatically apply based on colorScheme value
  // When colorScheme is 'dark', dark:bg-gray-900 applies
  // When colorScheme is 'light', bg-white applies

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <CurrentPage />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <StatusBar style="auto" />
    </View>
  );
}
