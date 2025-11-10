import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';

import './global.css';
import { BlogScreen } from 'components/screens/BlogScreen';
import { PortfolioScreen } from 'components/screens/PortfolioScreen';
import { ContactScreen } from 'components/screens/ContactScreen';
import { BottomNav } from 'components/BottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Blog', component: BlogScreen },
    { name: 'Portfolio', component: PortfolioScreen },
    { name: 'Contact', component: ContactScreen },
  ];

  const CurrentPage = tabs[activeTab].component;

  return (
    <View className="flex-1 bg-white">
      <CurrentPage />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <StatusBar style="auto" />
    </View>
  );
}
