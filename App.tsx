import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';

import './global.css';
import { BlogScreen } from 'components/screens/BlogScreen';
import { PortfolioScreen } from 'components/screens/PortfolioScreen';
import { ContactScreen } from 'components/screens/ContactScreen';
import { DebugScreen } from 'components/screens/DebugScreen';
import { BottomNav } from 'components/ui/navigation/BottomNav';
import { NAV_TABS } from 'components/constants';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Blog', component: BlogScreen, icon: NAV_TABS[0].icon, label: NAV_TABS[0].label },
    {
      name: 'Portfolio',
      component: PortfolioScreen,
      icon: NAV_TABS[1].icon,
      label: NAV_TABS[1].label,
    },
    { name: 'Contact', component: ContactScreen, icon: NAV_TABS[2].icon, label: NAV_TABS[2].label },
    { name: 'Debug', component: DebugScreen, icon: NAV_TABS[3].icon, label: NAV_TABS[3].label },
  ];

  const CurrentPage = tabs[activeTab].component;

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <CurrentPage />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <StatusBar style="auto" translucent backgroundColor="transparent" />
    </View>
  );
}
